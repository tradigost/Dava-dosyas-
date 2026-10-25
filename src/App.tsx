/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Player, 
  EnvelopeNumber, 
  SharedPin, 
  AccusationSubmission, 
  GameView,
  RoleType
} from './types';
import { CASE_SCENARIOS, ROLES } from './data/cases';
import { PlayerSimulatorBar } from './components/PlayerSimulatorBar';
import { PlayerInboxView } from './components/PlayerInboxView';
import { SharedCaseBoard } from './components/SharedCaseBoard';
import { EnvelopeGateModal } from './components/EnvelopeGateModal';
import { AccusationPhase } from './components/AccusationPhase';
import { CaseResolution } from './components/CaseResolution';
import { LobbyView } from './components/LobbyView';
import { OnlineRoomModal } from './components/OnlineRoomModal';
import { soundManager } from './utils/audioEffects';
import { 
  auth, 
  testFirestoreConnection,
  subscribeToRoom, 
  subscribeToRoomMembers, 
  subscribeToRoomPins, 
  subscribeToRoomVotes,
  addOnlineRoomPin,
  advanceOnlineRoomEnvelope,
  submitOnlineVote,
  setOnlineRoomStatus,
  incrementOnlineGateAttempts,
  OnlineRoom,
  OnlineMember
} from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  // Authentication & Online Room State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [onlineRoomCode, setOnlineRoomCode] = useState<string | null>(null);
  const [onlineRoom, setOnlineRoom] = useState<OnlineRoom | null>(null);
  const [onlineMembers, setOnlineMembers] = useState<OnlineMember[]>([]);
  const [isOnlineModalOpen, setIsOnlineModalOpen] = useState<boolean>(false);

  // Scenario and lobby state
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('son-kadeh');
  const [playerCount, setPlayerCount] = useState<number>(3);
  const [playerNames, setPlayerNames] = useState<string[]>([
    'Dr. Selim (Adli Tıp)',
    'Aslı (Kripto)',
    'Başkomiser Hakan (Profil)',
    'Murat (Saha)',
    'Zeynep (Kriminalistik)',
    'Can (Arşiv)',
  ]);

  // Active game view
  const [gameView, setGameView] = useState<GameView>('LOBBY');
  const [currentEnvelope, setCurrentEnvelope] = useState<EnvelopeNumber>(1);
  const [activePlayerId, setActivePlayerId] = useState<string>('p-1');
  const [isBoardViewOpen, setIsBoardViewOpen] = useState<boolean>(false);
  const [isGateModalOpen, setIsGateModalOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Evidence tracking
  const [pinnedItems, setPinnedItems] = useState<SharedPin[]>([]);
  const [pinnedEvidenceIds, setPinnedEvidenceIds] = useState<Set<string>>(new Set());
  const [gateAttempts, setGateAttempts] = useState<number>(0);

  // Accusation submissions: playerId -> submission
  const [submissions, setSubmissions] = useState<Record<string, AccusationSubmission>>({});

  const scenario = CASE_SCENARIOS.find((s) => s.id === selectedScenarioId) || CASE_SCENARIOS[0];

  // Auth observer
  useEffect(() => {
    testFirestoreConnection();
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  // URL Query Parser (?room=KND-884 or ?autostart=1)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room');
      if (roomParam) {
        setOnlineRoomCode(roomParam.toUpperCase());
        setIsOnlineModalOpen(true);
      }
      if (params.get('autostart') === '1') {
        setGameView('ENVELOPE_ACTIVE');
      }
    }
  }, []);

  // Real-time Firestore Room Sync
  useEffect(() => {
    if (!onlineRoomCode) return;

    const unsubRoom = subscribeToRoom(onlineRoomCode, (room) => {
      setOnlineRoom(room);
      if (room) {
        setCurrentEnvelope(room.currentEnvelope);
        setSelectedScenarioId(room.scenarioId);
        setGateAttempts(room.gateAttempts || 0);

        if (room.status === 'playing') {
          setGameView('ENVELOPE_ACTIVE');
        } else if (room.status === 'accusation') {
          setGameView('ACCUSATION');
        } else if (room.status === 'finished') {
          setGameView('FINAL_VERDICT');
        }
      }
    });

    const unsubMembers = subscribeToRoomMembers(onlineRoomCode, (members) => {
      setOnlineMembers(members);
    });

    const unsubPins = subscribeToRoomPins(onlineRoomCode, (pins) => {
      setPinnedItems(pins);
      const ids = new Set<string>();
      pins.forEach((p) => {
        if (p.evidenceId) ids.add(p.evidenceId);
      });
      setPinnedEvidenceIds(ids);
    });

    const unsubVotes = subscribeToRoomVotes(onlineRoomCode, (votes) => {
      setSubmissions(votes);
    });

    return () => {
      unsubRoom();
      unsubMembers();
      unsubPins();
      unsubVotes();
    };
  }, [onlineRoomCode]);

  // Build current players list:
  // If in online room with members, use online members; otherwise fallback to local table simulator
  const roleKeys: RoleType[] = ['forensics', 'cryptology', 'profiler', 'field', 'ballistics', 'archive'];
  const players: Player[] = onlineRoomCode && onlineMembers.length > 0
    ? onlineMembers.map((m, idx) => ({
        id: m.userId,
        name: m.displayName,
        role: m.role,
        avatar: m.photoURL || '',
        isHost: idx === 0,
      }))
    : Array.from({ length: playerCount }).map((_, idx) => ({
        id: `p-${idx + 1}`,
        name: playerNames[idx] || `Dedektif ${idx + 1}`,
        role: roleKeys[idx % roleKeys.length],
        avatar: '',
        isHost: idx === 0,
      }));

  // Match active player
  const activePlayer = players.find((p) => p.id === activePlayerId) || players[0];

  // If currentUser is in onlineMembers, ensure activePlayer defaults to currentUser
  useEffect(() => {
    if (currentUser && onlineMembers.length > 0) {
      const myMember = onlineMembers.find((m) => m.userId === currentUser.uid);
      if (myMember) {
        setActivePlayerId(myMember.userId);
      }
    }
  }, [currentUser, onlineMembers]);

  const handleStartGame = async () => {
    if (onlineRoomCode) {
      await setOnlineRoomStatus(onlineRoomCode, 'playing');
      await advanceOnlineRoomEnvelope(onlineRoomCode, 1);
    } else {
      setGameView('ENVELOPE_ACTIVE');
      setCurrentEnvelope(1);
      setActivePlayerId(players[0].id);
      setIsBoardViewOpen(false);
      setPinnedItems([]);
      setPinnedEvidenceIds(new Set());
      setSubmissions({});
      setGateAttempts(0);
    }
  };

  const handleNameChange = (index: number, newName: string) => {
    setPlayerNames((prev) => {
      const next = [...prev];
      next[index] = newName;
      return next;
    });
  };

  const handlePinEvidence = async (
    title: string,
    excerpt: string,
    category: string,
    evidenceId?: string
  ) => {
    const newPin: SharedPin = {
      id: `pin-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      evidenceId: evidenceId || `custom-${Date.now()}`,
      title,
      excerpt,
      category,
      pinnedByPlayerName: activePlayer.name,
      pinnedByRole: activePlayer.role,
      envelope: currentEnvelope,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    if (onlineRoomCode) {
      await addOnlineRoomPin(onlineRoomCode, newPin);
    } else {
      setPinnedItems((prev) => [newPin, ...prev]);
      if (evidenceId) {
        setPinnedEvidenceIds((prev) => new Set(prev).add(evidenceId));
      }
    }
  };

  const handleAddCustomNote = async (text: string) => {
    const newPin: SharedPin = {
      id: `custom-note-${Date.now()}`,
      evidenceId: `note-${Date.now()}`,
      title: `Dedektif Notu: ${activePlayer.name}`,
      excerpt: text,
      category: 'note',
      pinnedByPlayerName: activePlayer.name,
      pinnedByRole: activePlayer.role,
      envelope: currentEnvelope,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    if (onlineRoomCode) {
      await addOnlineRoomPin(onlineRoomCode, newPin);
    } else {
      setPinnedItems((prev) => [newPin, ...prev]);
    }
  };

  const handleAdvanceToNextEnvelope = async () => {
    setIsGateModalOpen(false);
    const nextEnv = (currentEnvelope === 1 ? 2 : currentEnvelope === 2 ? 3 : 4) as EnvelopeNumber;

    if (onlineRoomCode) {
      await advanceOnlineRoomEnvelope(onlineRoomCode, nextEnv);
    } else {
      if (currentEnvelope === 1) {
        setCurrentEnvelope(2);
      } else if (currentEnvelope === 2) {
        setCurrentEnvelope(3);
      } else {
        setGameView('ACCUSATION');
      }
    }
  };

  const handleSubmitVote = async (sub: AccusationSubmission) => {
    if (onlineRoomCode) {
      await submitOnlineVote(onlineRoomCode, sub);
    } else {
      setSubmissions((prev) => ({
        ...prev,
        [sub.playerId]: sub,
      }));
    }
  };

  const handleProceedToVerdict = async () => {
    soundManager.playSuccessSound();
    if (onlineRoomCode) {
      await setOnlineRoomStatus(onlineRoomCode, 'finished');
    } else {
      setGameView('FINAL_VERDICT');
      setCurrentEnvelope(4);
    }
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleGateIncrement = () => {
    if (onlineRoomCode) {
      incrementOnlineGateAttempts(onlineRoomCode);
    } else {
      setGateAttempts((c) => c + 1);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Player Simulator & Online Bar (always visible when game is ongoing) */}
      {gameView !== 'LOBBY' && (
        <PlayerSimulatorBar
          players={players}
          activePlayerId={activePlayerId}
          onSelectPlayer={(id) => {
            setActivePlayerId(id);
            setIsBoardViewOpen(false);
          }}
          isBoardViewOpen={isBoardViewOpen}
          onToggleBoardView={() => setIsBoardViewOpen((prev) => !prev)}
          currentEnvelope={currentEnvelope}
          pinnedCount={pinnedItems.length}
          unreadCountByPlayer={{}}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onlineRoomCode={onlineRoomCode}
          currentUser={currentUser}
          onOpenOnlineModal={() => setIsOnlineModalOpen(true)}
        />
      )}

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {gameView === 'LOBBY' && (
          <LobbyView
            scenarios={CASE_SCENARIOS}
            selectedScenarioId={selectedScenarioId}
            onSelectScenario={setSelectedScenarioId}
            playerCount={playerCount}
            onChangePlayerCount={setPlayerCount}
            playerNames={playerNames}
            onChangePlayerName={handleNameChange}
            onStartGame={handleStartGame}
            onOpenOnlineModal={() => setIsOnlineModalOpen(true)}
            currentUser={currentUser}
            onlineRoomCode={onlineRoomCode}
          />
        )}

        {gameView !== 'LOBBY' && (
          <>
            {/* If Board view toggle is active, show the Shared Board */}
            {isBoardViewOpen ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <button
                    type="button"
                    onClick={() => setIsBoardViewOpen(false)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                  >
                    &larr; {activePlayer.name} ({activePlayer.role.toUpperCase()}) Telefonuna Geri Dön
                  </button>
                  <span className="text-xs text-zinc-400 font-mono">
                    MASADAKİ TÜM KANITLAR
                  </span>
                </div>
                <SharedCaseBoard
                  pins={pinnedItems}
                  suspects={scenario.suspects}
                  activeEnvelope={currentEnvelope}
                  onAddCustomNote={handleAddCustomNote}
                />
              </div>
            ) : (
              <>
                {/* Active Envelope Inbox Screen */}
                {gameView === 'ENVELOPE_ACTIVE' && (
                  <PlayerInboxView
                    player={activePlayer}
                    currentEnvelope={currentEnvelope}
                    evidenceList={scenario.evidence}
                    suspects={scenario.suspects}
                    pinnedEvidenceIds={pinnedEvidenceIds}
                    onPinEvidence={handlePinEvidence}
                    onOpenGateModal={() => setIsGateModalOpen(true)}
                    onGoToAccusation={() => setGameView('ACCUSATION')}
                  />
                )}

                {/* Final Accusation & Debate Phase */}
                {gameView === 'ACCUSATION' && (
                  <AccusationPhase
                    players={players}
                    suspects={scenario.suspects}
                    activePlayerId={activePlayerId}
                    submissions={submissions}
                    onSubmitVote={handleSubmitVote}
                    onProceedToVerdict={handleProceedToVerdict}
                  />
                )}

                {/* Final Verdict & Scorecard Screen */}
                {gameView === 'FINAL_VERDICT' && (
                  <CaseResolution
                    scenario={scenario}
                    players={players}
                    submissions={submissions}
                    pinnedCount={pinnedItems.length}
                    gateAttempts={gateAttempts}
                    onRestartGame={handleStartGame}
                    onBackToLobby={() => {
                      setGameView('LOBBY');
                      setOnlineRoomCode(null);
                    }}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Envelope Gate Modal */}
      {isGateModalOpen && currentEnvelope <= 3 && scenario.gates[currentEnvelope as 1 | 2 | 3] && (
        <EnvelopeGateModal
          gate={scenario.gates[currentEnvelope as 1 | 2 | 3]}
          currentEnvelope={currentEnvelope as 1 | 2 | 3}
          onSuccessNextEnvelope={handleAdvanceToNextEnvelope}
          onClose={() => setIsGateModalOpen(false)}
          onIncrementAttempts={handleGateIncrement}
        />
      )}

      {/* Online Room & WhatsApp Modal */}
      {isOnlineModalOpen && (
        <OnlineRoomModal
          currentUser={currentUser}
          currentRoom={onlineRoom}
          roomMembers={onlineMembers}
          scenarios={CASE_SCENARIOS}
          selectedScenarioId={selectedScenarioId}
          onSelectScenario={setSelectedScenarioId}
          onRoomJoined={(code) => {
            setOnlineRoomCode(code);
          }}
          onStartOnlineGame={handleStartGame}
          onClose={() => setIsOnlineModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/80 py-4 px-4 text-center text-xs text-zinc-400">
        <p>Masadaki Dosya (Case Link) · Asimetrik Couch Co-Op Türkçe Dedektiflik Deneyimi</p>
      </footer>
    </div>
  );
}

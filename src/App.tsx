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
  RoleType,
  CaseScenario,
  getScenarioTotalEnvelopes
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
import { BriefingView } from './components/BriefingView';
import { WaitingTurnView } from './components/WaitingTurnView';
import { AuthModal } from './components/AuthModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { soundManager } from './utils/audioEffects';
import { 
  auth, 
  testFirestoreConnection,
  checkRedirectResult,
  subscribeToRoom, 
  subscribeToRoomMembers, 
  subscribeToRoomPins, 
  subscribeToRoomVotes,
  addOnlineRoomPin,
  advanceOnlineRoomEnvelope,
  submitOnlineVote,
  setOnlineRoomStatus,
  incrementOnlineGateAttempts,
  finishBriefingAndStartFirstEnvelope,
  passEnvelopeInspectorTurn,
  OnlineRoom, 
  OnlineMember,
  DetectiveProfile,
  subscribeToDetectiveAuth,
  subscribeToCustomCases
} from './services/firebase';

export default function App() {
  // Authentication & Online Room State
  const [currentUser, setCurrentUser] = useState<DetectiveProfile | null>(null);
  const [onlineRoomCode, setOnlineRoomCode] = useState<string | null>(null);
  const [onlineRoom, setOnlineRoom] = useState<OnlineRoom | null>(null);
  const [onlineMembers, setOnlineMembers] = useState<OnlineMember[]>([]);
  const [isOnlineModalOpen, setIsOnlineModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Scenario and lobby state
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('bogazda-kayip-koleksiyon');
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [playerNames, setPlayerNames] = useState<string[]>([
    'Dr. Selim (Adli Tıp & Kripto)',
    'Başkomiser Hakan (Profil & Sorgu)',
    'Aslı (Kripto)',
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

  // Local turn tracking for offline/simulator
  const [localInspectorId, setLocalInspectorId] = useState<string | null>(null);
  const [localEnvelopeCompleted, setLocalEnvelopeCompleted] = useState<boolean>(false);

  // Dynamic custom cases state
  const [customCases, setCustomCases] = useState<CaseScenario[]>([]);

  // Accusation submissions: playerId -> submission
  const [submissions, setSubmissions] = useState<Record<string, AccusationSubmission>>({});

  // Merge built-in cases with uploaded custom cases
  const allScenarios = [...CASE_SCENARIOS, ...customCases];
  const scenario = allScenarios.find((s) => s.id === selectedScenarioId) || allScenarios[0] || CASE_SCENARIOS[0];
  const totalEnvelopes = getScenarioTotalEnvelopes(scenario);

  // Subscribe to uploaded custom cases from Firestore
  useEffect(() => {
    const unsub = subscribeToCustomCases((cases) => {
      setCustomCases(cases);
    });
    return () => unsub();
  }, []);

  // Auth observer
  useEffect(() => {
    testFirestoreConnection();
    checkRedirectResult().catch((err) => {
      console.warn('Redirect result check:', err);
    });
    const unsub = subscribeToDetectiveAuth((profile) => {
      setCurrentUser(profile);
    });
    return () => unsub();
  }, []);

  // URL Query Parser (?room=KND-884, ?admin=1, or ?autostart=1)
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
      if (params.get('admin') === '1' || params.get('yonetici') === '1' || params.get('panel') === '1') {
        setIsAdminModalOpen(true);
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

        if (room.status === 'briefing') {
          setGameView('BRIEFING');
          setIsOnlineModalOpen(false);
        } else if (room.status === 'playing') {
          setGameView('ENVELOPE_ACTIVE');
          setIsOnlineModalOpen(false);
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
  const activeCount = onlineRoom?.playerCount || playerCount;
  const isSolo = activeCount === 1;
  const isTwoPlayer = activeCount === 2;

  const roleKeys: RoleType[] = isSolo
    ? ['forensics']
    : isTwoPlayer
    ? ['forensics', 'profiler']
    : ['forensics', 'cryptology', 'profiler', 'field', 'ballistics', 'archive'];

  const players: Player[] = onlineRoomCode && onlineMembers.length > 0
    ? onlineMembers.map((m, idx) => ({
        id: m.userId,
        name: m.displayName,
        role: m.role,
        avatar: m.photoURL || '',
        isHost: onlineRoom ? m.userId === onlineRoom.hostId : idx === 0,
      }))
    : Array.from({ length: playerCount }).map((_, idx) => ({
        id: `p-${idx + 1}`,
        name: isSolo ? (playerNames[0] || 'Dedektif') : (playerNames[idx] || `Dedektif ${idx + 1}`),
        role: roleKeys[idx % roleKeys.length],
        avatar: '',
        isHost: idx === 0,
      }));

  // If in online mode with members, ensure activePlayer strictly locks to the current user
  useEffect(() => {
    if (onlineRoomCode && onlineMembers.length > 0) {
      let myUid = currentUser?.uid;
      if (!myUid) {
        try {
          const saved = localStorage.getItem('detective_local_user');
          if (saved) {
            const parsed = JSON.parse(saved);
            myUid = parsed.uid;
          }
        } catch (e) {}
      }
      if (myUid) {
        const myMember = onlineMembers.find((m) => m.userId === myUid);
        if (myMember) {
          setActivePlayerId(myMember.userId);
        }
      }
    }
  }, [onlineRoomCode, currentUser, onlineMembers]);

  // Match active player
  const activePlayer = players.find((p) => p.id === activePlayerId) || players[0];

  // Turn management: which players participate in current envelope
  const currentEnvelopeEvidence = scenario.evidence.filter((ev) => ev.envelope === currentEnvelope);

  const participatingPlayers = isSolo
    ? players
    : players.filter((p) => {
        return currentEnvelopeEvidence.some((ev) => {
          if (isTwoPlayer) {
            if (p.role === 'forensics') {
              return ev.roleAccess.includes('forensics') || ev.roleAccess.includes('cryptology');
            }
            if (p.role === 'profiler') {
              const isLab = ev.roleAccess.includes('forensics') || ev.roleAccess.includes('cryptology');
              return !isLab;
            }
          }
          return ev.roleAccess.includes(p.role);
        });
      });

  const activeInspectorIdFromRoom = onlineRoom?.activeInspectorId;
  const isEnvelopeCompleted = Boolean(
    onlineRoomCode
      ? activeInspectorIdFromRoom === 'DONE'
      : localEnvelopeCompleted
  );

  const currentInspectorId = onlineRoomCode
    ? activeInspectorIdFromRoom || (participatingPlayers[0]?.id || players[0]?.id)
    : localInspectorId || (participatingPlayers[0]?.id || players[0]?.id);

  const currentInspectorPlayer = players.find((p) => p.id === currentInspectorId) || participatingPlayers[0] || players[0];
  const currentInspectorName = onlineRoom?.activeInspectorName || currentInspectorPlayer?.name || 'Dedektif';
  const currentInspectorRole = onlineRoom?.activeInspectorRole || currentInspectorPlayer?.role || 'forensics';

  const currentInspectorIndex = participatingPlayers.findIndex((p) => p.id === currentInspectorId);
  const nextInspector = !isSolo && (currentInspectorIndex >= 0 && currentInspectorIndex < participatingPlayers.length - 1)
    ? participatingPlayers[currentInspectorIndex + 1]
    : null;

  // In online multiplayer rooms, every player investigates the active envelope simultaneously on their own device!
  // WaitingTurnView is only for single-device pass-and-play offline mode.
  const isMyTurn = Boolean(onlineRoomCode) || isSolo || isEnvelopeCompleted || (
    activePlayerId === currentInspectorId
  );

  // Host starts the game from Lobby (moves to Briefing)
  const handleStartGame = async () => {
    if (onlineRoomCode) {
      await setOnlineRoomStatus(onlineRoomCode, 'briefing');
      await advanceOnlineRoomEnvelope(onlineRoomCode, 1);
    } else {
      setGameView('BRIEFING');
      setCurrentEnvelope(1);
      setActivePlayerId(players[0].id);
      setLocalInspectorId(null);
      setLocalEnvelopeCompleted(false);
      setIsBoardViewOpen(false);
      setPinnedItems([]);
      setPinnedEvidenceIds(new Set());
      setSubmissions({});
      setGateAttempts(0);
    }
  };

  // Host finishes reading briefing aloud and hands first envelope to first specialist
  const handleFinishBriefing = async () => {
    const firstInspector = participatingPlayers[0] || players[0];
    if (onlineRoomCode) {
      await finishBriefingAndStartFirstEnvelope(onlineRoomCode, {
        id: firstInspector.id,
        name: firstInspector.name,
        role: firstInspector.role,
      });
    } else {
      setGameView('ENVELOPE_ACTIVE');
      setLocalInspectorId(firstInspector.id);
      setActivePlayerId(firstInspector.id);
      setLocalEnvelopeCompleted(false);
    }
  };

  // Active inspector closes dossier and passes turn to next player in envelope
  const handlePassTurn = async () => {
    if (nextInspector) {
      if (onlineRoomCode) {
        await passEnvelopeInspectorTurn(onlineRoomCode, {
          id: nextInspector.id,
          name: nextInspector.name,
          role: nextInspector.role,
        });
      } else {
        setLocalInspectorId(nextInspector.id);
        setActivePlayerId(nextInspector.id);
      }
    } else {
      // All participating players have reviewed files in this envelope
      if (onlineRoomCode) {
        await passEnvelopeInspectorTurn(onlineRoomCode, null);
      } else {
        setLocalEnvelopeCompleted(true);
      }
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
    const nextEnv = currentEnvelope + 1;

    if (nextEnv <= totalEnvelopes) {
      const nextEnvelopeEvidence = scenario.evidence.filter((ev) => ev.envelope === nextEnv);
      const nextParticipants = players.filter((p) => {
        return nextEnvelopeEvidence.some((ev) => {
          if (isTwoPlayer) {
            if (p.role === 'forensics') return ev.roleAccess.includes('forensics') || ev.roleAccess.includes('cryptology');
            if (p.role === 'profiler') return !ev.roleAccess.includes('forensics') && !ev.roleAccess.includes('cryptology');
          }
          return ev.roleAccess.includes(p.role);
        });
      });
      const firstInspector = nextParticipants[0] || players[0];

      if (onlineRoomCode) {
        await advanceOnlineRoomEnvelope(onlineRoomCode, nextEnv, totalEnvelopes);
        await passEnvelopeInspectorTurn(onlineRoomCode, {
          id: firstInspector.id,
          name: firstInspector.name,
          role: firstInspector.role,
        });
      } else {
        setCurrentEnvelope(nextEnv);
        setLocalInspectorId(firstInspector.id);
        setActivePlayerId(firstInspector.id);
        setLocalEnvelopeCompleted(false);
      }
    } else {
      if (onlineRoomCode) {
        await setOnlineRoomStatus(onlineRoomCode, 'accusation');
      } else {
        setGameView('ACCUSATION');
      }
    }
  };

  const handleSubmitVote = async (sub: AccusationSubmission) => {
    // Optimistically update local submissions state immediately
    setSubmissions((prev) => ({
      ...prev,
      [sub.playerId]: sub,
    }));
    if (onlineRoomCode) {
      try {
        await submitOnlineVote(onlineRoomCode, sub);
      } catch (err) {
        console.error('Error submitting vote to room:', err);
      }
    }
  };

  const handleProceedToVerdict = async () => {
    soundManager.playSuccessSound();
    if (onlineRoomCode) {
      await setOnlineRoomStatus(onlineRoomCode, 'finished');
    } else {
      setGameView('FINAL_VERDICT');
      setCurrentEnvelope(totalEnvelopes + 1);
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
      {/* Top Bar (only visible when actively playing an envelope or viewing board) */}
      {gameView !== 'LOBBY' && gameView !== 'BRIEFING' && (
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
          totalEnvelopes={totalEnvelopes}
          pinnedCount={pinnedItems.length}
        />
      )}

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {gameView === 'LOBBY' && (
          <LobbyView
            scenarios={allScenarios}
            selectedScenarioId={selectedScenarioId}
            onSelectScenario={setSelectedScenarioId}
            playerCount={playerCount}
            onChangePlayerCount={setPlayerCount}
            playerNames={playerNames}
            onChangePlayerName={handleNameChange}
            onStartGame={handleStartGame}
            onOpenOnlineModal={() => setIsOnlineModalOpen(true)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
            currentUser={currentUser}
            onlineRoomCode={onlineRoomCode}
          />
        )}

        {/* Phase 1: Case Briefing & Prologue Narrative */}
        {gameView === 'BRIEFING' && (
          <BriefingView
            scenario={scenario}
            isHost={onlineRoom ? (currentUser?.uid === onlineRoom.hostId) : true}
            hostName={onlineRoom ? onlineRoom.hostName : (players[0]?.name || 'Masa Şefi')}
            firstInspector={participatingPlayers[0] || players[0]}
            onFinishBriefing={handleFinishBriefing}
          />
        )}

        {gameView !== 'LOBBY' && gameView !== 'BRIEFING' && (
          <>
            {/* If Board view toggle is active, show the Shared Board */}
            {isBoardViewOpen ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <button
                    type="button"
                    onClick={() => setIsBoardViewOpen(false)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
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
                  totalEnvelopes={totalEnvelopes}
                  onAddCustomNote={handleAddCustomNote}
                />
              </div>
            ) : (
              <>
                {/* Active Envelope Inbox Screen: Either the active dossier OR the clean Waiting Screen */}
                {gameView === 'ENVELOPE_ACTIVE' && (
                  !isMyTurn ? (
                    /* Other players see ONLY logo and active inspector name */
                    <WaitingTurnView
                      currentEnvelope={currentEnvelope}
                      totalEnvelopes={totalEnvelopes}
                      activeInspectorName={currentInspectorName}
                      activeInspectorRole={currentInspectorRole}
                    />
                  ) : (
                    /* Active inspector sees their confidential dossier */
                    <PlayerInboxView
                      player={activePlayer}
                      allPlayers={players}
                      totalPlayers={onlineRoom?.playerCount || playerCount}
                      currentEnvelope={currentEnvelope}
                      totalEnvelopes={totalEnvelopes}
                      evidenceList={scenario.evidence}
                      suspects={scenario.suspects}
                      pinnedEvidenceIds={pinnedEvidenceIds}
                      onPinEvidence={handlePinEvidence}
                      onAdvanceEnvelope={handleAdvanceToNextEnvelope}
                      onGoToAccusation={() => setGameView('ACCUSATION')}
                      nextInspector={nextInspector}
                      onPassTurn={handlePassTurn}
                      isEnvelopeCompleted={isEnvelopeCompleted}
                    />
                  )
                )}

                {/* Final Accusation & Debate Phase */}
                {gameView === 'ACCUSATION' && (
                  <AccusationPhase
                    scenario={scenario}
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
                    currentUser={currentUser}
                    onOpenAuthModal={() => setIsAuthModalOpen(true)}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Online Room & WhatsApp Modal */}
      {isOnlineModalOpen && (
        <OnlineRoomModal
          currentUser={currentUser}
          currentRoom={onlineRoom}
          roomMembers={onlineMembers}
          scenarios={allScenarios}
          selectedScenarioId={selectedScenarioId}
          onSelectScenario={setSelectedScenarioId}
          playerCount={playerCount}
          onChangePlayerCount={setPlayerCount}
          initialRoomCode={onlineRoomCode}
          onRoomJoined={(code) => {
            setOnlineRoomCode(code);
          }}
          onStartOnlineGame={handleStartGame}
          onClose={() => setIsOnlineModalOpen(false)}
        />
      )}

      {/* Detective Auth & Membership Modal */}
      {isAuthModalOpen && (
        <AuthModal
          currentUser={currentUser}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {/* Admin Dashboard & Mobile Stores Blueprint Modal */}
      {isAdminModalOpen && (
        <AdminDashboardModal
          currentUser={currentUser}
          customCases={customCases}
          onClose={() => setIsAdminModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/80 py-4 px-4 text-center text-xs text-zinc-400">
        <p>Masadaki Dosya (Case Link) · Asimetrik Couch Co-Op Türkçe Dedektiflik Deneyimi</p>
      </footer>
    </div>
  );
}

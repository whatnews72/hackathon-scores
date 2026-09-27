import { useEffect, useReducer, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { DEFAULT_STATE } from '../lib/hackathon';
import { useToast } from './useToast';

const initialState = {
  state: DEFAULT_STATE,
  scores: [],
  connected: false,
  mode: 'connecting',
};

function socketReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        state: action.payload.state || DEFAULT_STATE,
        scores: action.payload.scores || [],
        connected: true,
        mode: 'live',
      };
    case 'STATE_UPDATE':
      return {
        ...state,
        state: action.payload,
      };
    case 'SCORE_UPSERTED':
      return {
        ...state,
        scores: state.scores.filter(s => s.id !== action.payload.id).concat(action.payload),
      };
    case 'SCORE_PATCHED':
      return {
        ...state,
        scores: state.scores.map(s =>
          s.id === action.payload.id
            ? { ...s, ...action.payload.patch }
            : s
        ),
      };
    case 'SCORES_CLEARED':
      return {
        ...state,
        scores: [],
      };
    case 'SCORES_BATCH':
      return {
        ...state,
        scores: state.scores.concat(action.payload),
      };
    case 'DISCONNECT':
      return {
        ...state,
        connected: false,
        mode: 'connecting',
      };
    default:
      return state;
  }
}

export function useHackathonSocket() {
  const [state, dispatch] = useReducer(socketReducer, initialState);
  const socketRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
    const socket = io(socketUrl, {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket] 연결됨');
    });

    socket.on('hk:init', (payload) => {
      console.log('[Socket] 초기 데이터 수신');
      dispatch({ type: 'INIT', payload });
    });

    socket.on('hk:state', (payload) => {
      dispatch({ type: 'STATE_UPDATE', payload: payload.state });
    });

    socket.on('hk:scoreUpserted', (payload) => {
      dispatch({ type: 'SCORE_UPSERTED', payload: payload.score });
    });

    socket.on('hk:scorePatched', (payload) => {
      dispatch({ type: 'SCORE_PATCHED', payload: payload });
    });

    socket.on('hk:scoresCleared', () => {
      dispatch({ type: 'SCORES_CLEARED' });
    });

    socket.on('hk:scoresUpsertedBatch', (payload) => {
      dispatch({ type: 'SCORES_BATCH', payload: payload.scores || [] });
    });

    socket.on('hk:error', (payload) => {
      toast(payload.message || '오류가 발생했습니다.');
    });

    socket.on('disconnect', () => {
      console.log('[Socket] 연결 해제됨');
      dispatch({ type: 'DISCONNECT' });
      toast('실시간 연결이 끊겼어요. 페이지를 새로고침해 주세요.');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const actions = {
    setState: (patch) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('hk:setState', { patch });
      }
    },
    submitScore: (payload) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('hk:submitScore', payload);
      }
    },
    patchScore: (id, patch) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('hk:patchScore', { id, patch });
      }
    },
    clearScores: () => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('hk:clearScores', {});
      }
    },
    demoFill: (team) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('hk:demoFill', { team });
      }
    },
  };

  return {
    state: state.state,
    scores: state.scores,
    connected: state.connected,
    mode: state.mode,
    actions,
  };
}

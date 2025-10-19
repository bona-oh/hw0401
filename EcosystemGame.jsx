import React, { useState } from 'react';
import { Users, Award, Target } from 'lucide-react';

const EcosystemGame = () => {
  const [gameState, setGameState] = useState('setup');
  const [teamInfo, setTeamInfo] = useState({ name: '', members: '' });
  const [difficulty, setDifficulty] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const questions = {
    easy: [
      { name: '풀', answer: 'producer' },
      { name: '사자', answer: 'consumer' },
      { name: '버섯', answer: 'decomposer' },
      { name: '나무', answer: 'producer' },
      { name: '토끼', answer: 'consumer' },
      { name: '곰팡이', answer: 'decomposer' },
      { name: '꽃', answer: 'producer' },
      { name: '호랑이', answer: 'consumer' },
      { name: '이끼', answer: 'producer' },
      { name: '독수리', answer: 'consumer' },
      { name: '박테리아', answer: 'decomposer' },
      { name: '옥수수', answer: 'producer' },
      { name: '개구리', answer: 'consumer' },
      { name: '벼', answer: 'producer' },
      { name: '고양이', answer: 'consumer' },
      { name: '지렁이', answer: 'decomposer' },
      { name: '해바라기', answer: 'producer' },
      { name: '뱀', answer: 'consumer' },
      { name: '소나무', answer: 'producer' },
      { name: '매', answer: 'consumer' }
    ],
    medium: [
      { name: '규조류', answer: 'producer' },
      { name: '메뚜기', answer: 'consumer' },
      { name: '흰개미', answer: 'decomposer' },
      { name: '클로렐라', answer: 'producer' },
      { name: '거미', answer: 'consumer' },
      { name: '효모균', answer: 'decomposer' },
      { name: '다시마', answer: 'producer' },
      { name: '매미', answer: 'consumer' },
      { name: '푸른곰팡이', answer: 'decomposer' },
      { name: '김', answer: 'producer' },
      { name: '잠자리', answer: 'consumer' },
      { name: '방선균', answer: 'decomposer' },
      { name: '미역', answer: 'producer' },
      { name: '하루살이', answer: 'consumer' },
      { name: '고초균', answer: 'decomposer' },
      { name: '파래', answer: 'producer' },
      { name: '노린재', answer: 'consumer' },
      { name: '젖산균', answer: 'decomposer' },
      { name: '청각', answer: 'producer' },
      { name: '무당벌레', answer: 'consumer' }
    ],
    hard: [
      { name: '남조류', answer: 'producer' },
      { name: '와편모조류', answer: 'producer' },
      { name: '짚신벌레', answer: 'consumer' },
      { name: '아메바', answer: 'consumer' },
      { name: '대장균', answer: 'decomposer' },
      { name: '유글레나', answer: 'producer' },
      { name: '해파리', answer: 'consumer' },
      { name: '말미잘', answer: 'consumer' },
      { name: '질산화 세균', answer: 'decomposer' },
      { name: '규산편모조류', answer: 'producer' },
      { name: '산호', answer: 'consumer' },
      { name: '탈질산 세균', answer: 'decomposer' },
      { name: '녹조류', answer: 'producer' },
      { name: '히드라', answer: 'consumer' },
      { name: '황화세균', answer: 'decomposer' },
      { name: '유글레나충', answer: 'producer' },
      { name: '윤충', answer: 'consumer' },
      { name: '철세균', answer: 'decomposer' },
      { name: '스피루리나', answer: 'producer' },
      { name: '섬모충', answer: 'consumer' }
    ]
  };

  const categories = {
    producer: { label: '생산자', color: 'bg-green-500', desc: '광합성으로 유기물 생산' },
    consumer: { label: '소비자', color: 'bg-blue-500', desc: '다른 생물을 먹어 에너지 얻음' },
    decomposer: { label: '분해자', color: 'bg-orange-500', desc: '죽은 생물을 분해' }
  };

  const handleSetupSubmit = () => {
    if (teamInfo.name && teamInfo.members) {
      setGameState('difficulty');
    }
  };

  const handleDifficultySelect = (level) => {
    setDifficulty(level);
    setGameState('playing');
  };

  const handleAnswer = (selectedAnswer) => {
    const currentQuestions = questions[difficulty];
    const current = currentQuestions[currentIndex];
    const isCorrect = selectedAnswer === current.answer;
    
    setAttempts(attempts + 1);
    
    if (isCorrect) {
      setScore(score + 10);
      setFeedback('정답입니다! 🎉 (+10점)');
    } else {
      setScore(score - 5);
      setFeedback('틀렸습니다! 😢 (-5점) 정답: ' + categories[current.answer].label);
    }

    setAnsweredQuestions([...answeredQuestions, {
      question: current.name,
      selected: selectedAnswer,
      correct: current.answer,
      isCorrect
    }]);

    setTimeout(() => {
      if (currentIndex < currentQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setFeedback('');
      } else {
        setGameState('result');
      }
    }, 1500);
  };

  const resetGame = () => {
    setGameState('setup');
    setTeamInfo({ name: '', members: '' });
    setDifficulty('');
    setScore(0);
    setAttempts(0);
    setCurrentIndex(0);
    setFeedback('');
    setAnsweredQuestions([]);
  };

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-700 mb-2">🌿 생태계 생물 분류 게임</h1>
            <p className="text-gray-600">생산자, 소비자, 분해자를 구분해보세요!</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                <Users className="inline mr-2" size={20} />
                팀 이름
              </label>
              <input
                type="text"
                value={teamInfo.name}
                onChange={(e) => setTeamInfo({...teamInfo, name: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                placeholder="예: 생태계 탐험가"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                팀원 이름과 번호
              </label>
              <textarea
                value={teamInfo.members}
                onChange={(e) => setTeamInfo({...teamInfo, members: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                placeholder="예: 김민수 (3번), 이지은 (7번), 박준호 (15번)"
                rows={5}
              />
            </div>

            <button
              onClick={handleSetupSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors"
            >
              다음 단계로 →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'difficulty') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-700 mb-4">난이도 선택</h1>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-lg">팀명: {teamInfo.name}</p>
              <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{teamInfo.members}</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleDifficultySelect('easy')}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-6 rounded-lg text-xl transition-all transform hover:scale-105"
            >
              <div>
                <Target className="inline mr-2" size={24} />
                쉬움 (초급)
              </div>
              <p className="text-sm mt-1">풀, 사자, 버섯 등 기본 생물</p>
            </button>

            <button
              onClick={() => handleDifficultySelect('medium')}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-6 px-6 rounded-lg text-xl transition-all transform hover:scale-105"
            >
              <div>
                <Target className="inline mr-2" size={24} />
                보통 (중급)
              </div>
              <p className="text-sm mt-1">규조류, 메뚜기, 효모균 등</p>
            </button>

            <button
              onClick={() => handleDifficultySelect('hard')}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-6 px-6 rounded-lg text-xl transition-all transform hover:scale-105"
            >
              <div>
                <Target className="inline mr-2" size={24} />
                어려움 (고급)
              </div>
              <p className="text-sm mt-1">남조류, 짚신벌레, 질산화 세균 등</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const currentQuestions = questions[difficulty];
    const current = currentQuestions[currentIndex];
    const progress = ((currentIndex + 1) / currentQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-600">팀: {teamInfo.name}</p>
                <p className="text-2xl font-bold text-green-700">점수: {score}점</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">진행 상황</p>
                <p className="text-2xl font-bold text-blue-700">{currentIndex + 1} / {currentQuestions.length}</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: progress + '%' }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 mb-8 text-center">
              <p className="text-gray-600 mb-2">이 생물을 분류하세요:</p>
              <h2 className="text-5xl font-bold text-gray-800">{current.name}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Object.entries(categories).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => handleAnswer(key)}
                  disabled={feedback !== ''}
                  className={cat.color + ' hover:opacity-90 text-white font-bold py-8 px-6 rounded-xl text-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'}
                >
                  <div>{cat.label}</div>
                  <div className="text-xs mt-2 opacity-90">{cat.desc}</div>
                </button>
              ))}
            </div>

            {feedback && (
              <div className={'text-center p-4 rounded-lg text-xl font-bold ' + (feedback.includes('정답') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                {feedback}
              </div>
            )}

            <div className="mt-6 text-center text-gray-600">
              <p>시도 횟수: {attempts}번</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    const correctCount = answeredQuestions.filter(q => q.isCorrect).length;
    const accuracy = ((correctCount / answeredQuestions.length) * 100).toFixed(1);

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <Award className="mx-auto text-yellow-500 mb-4" size={80} />
            <h1 className="text-4xl font-bold text-green-700 mb-2">게임 종료!</h1>
            <p className="text-xl text-gray-600">수고하셨습니다, {teamInfo.name}!</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">최종 점수</p>
              <p className="text-4xl font-bold text-blue-700">{score}점</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">정확도</p>
              <p className="text-4xl font-bold text-green-700">{accuracy}%</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">정답 개수</p>
              <p className="text-4xl font-bold text-purple-700">{correctCount}/{answeredQuestions.length}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">시도 횟수</p>
              <p className="text-4xl font-bold text-orange-700">{attempts}번</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800">문제 결과</h3>
            {answeredQuestions.map((q, idx) => (
              <div key={idx} className={'mb-3 p-3 rounded ' + (q.isCorrect ? 'bg-green-100' : 'bg-red-100')}>
                <span className="font-semibold">{idx + 1}. {q.question}</span>
                <span className="ml-2">
                  {q.isCorrect ? '✓' : '✗ (정답: ' + categories[q.correct].label + ')'}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={resetGame}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors"
          >
            새 게임 시작하기
          </button>
        </div>
      </div>
    );
  }
};

export default EcosystemGame;

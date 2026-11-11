/**
 * Module đánh giá kết quả bài thi trắc nghiệm đa định dạng
 * Hỗ trợ 7 dạng câu hỏi: single, multiple, true_false_multi, short_answer/fill_blank, drag_drop, categorize, essay
 */

export function evaluateUserAnswers(questions = [], selectedAnswers = {}) {
  const safeQuestions = Array.isArray(questions) ? questions : [];
  let correctCount = 0;

  const evaluatedQuestions = safeQuestions.map(q => {
    const userAns = selectedAnswers[q.id];
    let isCorrect = false;

    if (!q.type || q.type === 'single') {
      const correctPossible = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
      isCorrect = userAns !== undefined && userAns !== null && userAns !== '' &&
        correctPossible.some(c => c === userAns || String(c).trim() === String(userAns).trim());
    } else if (q.type === 'multiple') {
      const correctList = Array.isArray(q.correctAnswer)
        ? [...q.correctAnswer].map(c => String(c).trim()).filter(Boolean).sort()
        : [String(q.correctAnswer || '').trim()].filter(Boolean);
      const userList = Array.isArray(userAns)
        ? [...userAns].map(c => String(c).trim()).filter(Boolean).sort()
        : [];
      isCorrect = correctList.length > 0 && JSON.stringify(correctList) === JSON.stringify(userList);
    } else if (q.type === 'true_false_multi' || q.type === 'true_false') {
      const subAns = typeof userAns === 'object' && userAns !== null ? userAns : {};
      const parts = q.parts || [];
      const correctParts = parts.filter(p => {
        const expected = p.isCorrect !== undefined ? Boolean(p.isCorrect) : (p.correct !== undefined ? Boolean(p.correct) : true);
        return subAns[p.id] !== undefined && Boolean(subAns[p.id]) === expected;
      });
      isCorrect = parts.length > 0 && correctParts.length === parts.length;
    } else if (q.type === 'short_answer' || q.type === 'fill_blank') {
      if (q.blanks && q.blanks.length > 0) {
        const clozeAns = typeof userAns === 'object' && userAns !== null ? userAns : {};
        isCorrect = q.blanks.every(b => {
          const val = (clozeAns[b.id] || '').trim().toLowerCase();
          const accepted = Array.isArray(b.correctAnswer)
            ? b.correctAnswer.map(c => String(c).toLowerCase().trim())
            : [String(b.correctAnswer || '').toLowerCase().trim()];
          return val.length > 0 && accepted.includes(val);
        });
      } else {
        const formattedUser = (userAns || '').toString().trim().toLowerCase();
        const correctPossible = Array.isArray(q.correctAnswer)
          ? q.correctAnswer.map(c => String(c).trim().toLowerCase())
          : [String(q.correctAnswer || '').trim().toLowerCase()];
        isCorrect = formattedUser.length > 0 && correctPossible.includes(formattedUser);
      }
    } else if (q.type === 'drag_drop') {
      const userSlots = typeof userAns === 'object' && userAns !== null ? userAns : {};
      const sentences = q.sentences || [];
      isCorrect = sentences.length > 0 && sentences.every(s => {
        const userChoice = String(userSlots[s.id] || '').trim().toLowerCase();
        const correctChoice = String(s.correctWord || s.correctItemId || s.correctAnswer || '').trim().toLowerCase();
        return userChoice.length > 0 && userChoice === correctChoice;
      });
    } else if (q.type === 'categorize') {
      const userAssignments = typeof userAns === 'object' && userAns !== null ? userAns : {};
      const items = q.items || [];
      isCorrect = items.length > 0 && items.every(it => {
        const targetColId = it.categoryId || it.targetCategory;
        const targetCol = userAssignments[targetColId] || [];
        return targetCol.some(cItem => cItem.id === it.id || cItem.text === it.text);
      });
    } else if (q.type === 'essay') {
      const essayObj = typeof userAns === 'object' && userAns !== null ? userAns : { text: userAns };
      const aiScore = essayObj?.aiResult?.score ?? (essayObj?.score ?? 0);
      const maxScore = q.maxScore || 10;
      isCorrect = aiScore >= (maxScore * 0.5);
    } else {
      isCorrect = Boolean(userAns);
    }

    if (isCorrect) correctCount += 1;

    return {
      ...q,
      userAns,
      isCorrect
    };
  });

  const totalQuestions = safeQuestions.length;
  const incorrectCount = Math.max(0, totalQuestions - correctCount);
  const accuracyPercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Tính chuỗi câu đúng liên tiếp dài nhất (Max Streak)
  let currentRun = 0;
  let maxStreak = 0;
  evaluatedQuestions.forEach(q => {
    if (q.isCorrect) {
      currentRun += 1;
      if (currentRun > maxStreak) maxStreak = currentRun;
    } else {
      currentRun = 0;
    }
  });

  return {
    evaluatedQuestions,
    correctCount,
    totalQuestions,
    incorrectCount,
    accuracyPercent,
    maxStreak
  };
}

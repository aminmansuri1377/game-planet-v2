import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTranslation } from "react-i18next";
import { trpc } from "../../utils/trpc";
import Confetti from "react-confetti";
import BackButton from "./BackButton";
import LoadingAnimation from "./LoadingAnimation";
import Box from "./Box";
import Button from "./Button";
import Leaderboard from "./Leaderboard";
import { useRouter } from "next/router";

const Game = () => {
  const { t } = useTranslation();
  const [score, setScore] = useState(0);

  const [result, setResult] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);

  const router = useRouter();
  const { userId } = router.query;

  const {
    data: choices,
    isLoading,
    refetch,
  } = trpc.main.getChoices.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const updateScore = trpc.main.updateUserScore.useMutation();

  useEffect(() => {
    if (timeLeft > 0 && questionCount < 7) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && questionCount < 7) {
      handleNextQuestion(false); // If time runs out, treat it as a wrong answer
    }
  }, [timeLeft, questionCount]);

  const checkAnswer = trpc.main.checkAnswer.useMutation({
    onSuccess: (isReal) => {
      setIsCorrect(isReal);
      setResult(isReal ? t("game.correct") : t("game.wrong"));
      if (isReal) {
        setScore(score + 1);
      }

      // Determine the correct answer from choices
      const correct = choices?.find((choice) => choice.isReal);
      if (correct) {
        setCorrectAnswer(correct.word);
      }

      // Show feedback and then move to the next question
      setTimeout(() => {
        handleNextQuestion(isReal);
      }, 1200);
    },
  });

  const handleNextQuestion = async (isReal: boolean) => {
    setSelectedChoice(null);
    await refetch(); // Ensure refetch happens, but you might want to handle loading states
    setQuestionCount((prev) => prev + 1);
    setIsCorrect(null);
    setCorrectAnswer(null);
    setTimeLeft(10);

    if (questionCount + 1 === 7) {
      checkWinCondition();
      setShowResults(true);
    }
  };

  const checkWinCondition = () => {
    const winCondition = score >= 3;
    setGameWon(winCondition);
    if (winCondition) {
      setShowConfetti(true);
    }
    updateScore.mutate({ userId: Number(userId), score });
  };

  const handleGuess = (chosenWord: string) => {
    setSelectedChoice(chosenWord);
  };

  const handleSubmitAnswer = () => {
    if (selectedChoice) {
      checkAnswer.mutate({ word: selectedChoice });
    } else {
      setResult(t("game.selectOptionFirst"));
    }
  };

  const getLevel = (score: number) => {
    if (score < 5) return t("game.levelBeginner");
    if (score < 10) return t("game.levelIntermediate");
    if (score < 20) return t("game.levelAdvanced");
    return t("game.levelExpert");
  };

  const getBadge = (score: number) => {
    if (score >= 20) return t("game.badgeMaster");
    if (score >= 10) return t("game.badgePro");
    if (score >= 5) return t("game.badgeNovice");
    return t("game.badgeNoob");
  };

  const handleResetGame = () => {
    setScore(0);

    setQuestionCount(0);
    setShowResults(false);
    setShowConfetti(false);
    setGameWon(false);
    setTimeLeft(10);
    setResult("");
    refetch(); // Get new set of words
  };

  return (
    <>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <div>
          <BackButton />
          <div>
            {showConfetti && <Confetti />}
            {choices && !showResults ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-lg font-bold text-gray-800">
                    {questionCount + 1}/7
                  </h2>
                </div>
                <h1 className="sm:text-3xl text-2xl text-center font-bold mb-16 text-gray-900">
                  {isCorrect === null ? t("game.question") : result}
                </h1>
                <Box>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {choices.map((choice) => (
                      <button
                        key={choice.word}
                        className={`md:text-xl py-5 px-8 rounded-lg text-white font-semibold transition-transform transform hover:scale-105 disabled:cursor-not-allowed ${
                          selectedChoice === choice.word
                            ? isCorrect === null
                              ? "bg-blue-700"
                              : isCorrect
                              ? "bg-green-500"
                              : choice.word === correctAnswer
                              ? "bg-green-500"
                              : "bg-red-500"
                            : choice.word === correctAnswer
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                        onClick={() => handleGuess(choice.word)}
                        disabled={isCorrect !== null}
                      >
                        {choice.word}
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={isCorrect !== null}
                  >
                    {t("game.submitAnswer")}
                    <span className="ripple"></span>
                  </Button>

                  <p className="text-lg font-medium mt-8 text-center text-gray-800">
                    {t("game.timeLeft")}: {timeLeft} seconds
                  </p>
                </Box>
              </>
            ) : (
              showResults && (
                <Box>
                  <div className="mb-8">
                    <h1
                      className={`sm:text-4xl text-3xl text-center font-bold glow-text animate__animated mb-12 ${
                        gameWon
                          ? "text-green-500 animate__tada"
                          : "text-red-500 animate__bounce"
                      }`}
                    >
                      {gameWon ? t("game.youWon") : t("game.gameOver")}
                    </h1>
                    <p className="text-2xl font-bold text-center text-gray-800">
                      {t("game.score")}: {score}
                    </p>
                    <p className="text-xl font-medium text-center text-gray-800 mt-4">
                      {t("game.level")}: {getLevel(score)}
                    </p>
                    <p className="text-xl font-medium text-center text-gray-800 mt-2">
                      {t("game.badge")}: {getBadge(score)}
                    </p>
                  </div>
                  <Leaderboard />
                  <div className="grid md:grid-cols-2 gap-4 mb-2 mt-6">
                    <Button
                      className="w-full"
                      onClick={() => router.replace("/")}
                    >
                      {t("game.goHome")}
                    </Button>
                    <Button
                      className="w-full bg-transparent"
                      onClick={handleResetGame}
                    >
                      {t("game.playAgain")}
                    </Button>
                  </div>
                </Box>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Game;

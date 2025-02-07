import { trpc } from "../../utils/trpc";
import { useTranslation } from "react-i18next";
import { getBadge } from "../../utils/gameHelpers";

const Leaderboard = ({ currentUser }) => {
  const { t } = useTranslation();
  const { data: leaderboard, isLoading } = trpc.main.getLeaderboard.useQuery();

  const rankHandler = (i: number) => {
    switch (i) {
      case 1:
        return "🏆";
      case 2:
        return "🥈";
      case 3:
        return "🥉";

      default:
        return i;
    }
  };

  if (isLoading) return <p>Loading leaderboard...</p>;
  if (leaderboard?.length === 0) return;

  return (
    <div className="overflow-x-auto rounded-2xl">
      <table className="w-full table-auto text-center">
        <thead>
          <tr className="bg-white bg-opacity-20 text-white">
            <th className="py-2 px-4 text-sm sm:text-base border-b border-gray-200">
              {t("leaderboard.rank")}
            </th>
            <th className="py-2 px-4 text-sm sm:text-base border-b border-gray-200">
              {t("leaderboard.player")}
            </th>
            <th className="py-2 px-4 text-sm sm:text-base border-b border-gray-200 hidden sm:block">
              {t("leaderboard.badge")}
            </th>
            <th className="py-2 px-4 text-sm sm:text-base border-b border-gray-200">
              {t("leaderboard.score")}
            </th>
          </tr>
        </thead>
        <tbody>
          {leaderboard?.map((user, index) => (
            <tr
              key={user.id}
              className={`bg-white bg-opacity-20 hover:bg-opacity-35 transition-opacity animate__animated ${
                index % 2 === 0 ? "bg-opacity-10" : "bg-opacity-15"
              } ${
                user.name === currentUser
                  ? "bg-indigo-800 animate__rubberBand"
                  : ""
              }`}
            >
              <td className="py-2 px-4 border-b border-gray-200 text-white">
                {rankHandler(index + 1)}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-stone-700 font-semibold">
                {user.name}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-stone-700 hidden sm:block">
                <span
                  className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold text-nowrap ${
                    getBadge(user.score, t) === "Master"
                      ? "bg-yellow-500"
                      : getBadge(user.score, t) === "Pro"
                      ? "bg-zinc-400"
                      : getBadge(user.score, t) === "Novice"
                      ? "bg-orange-900"
                      : "bg-violet-100"
                  }`}
                >
                  {getBadge(user.score, t)}
                </span>
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-stone-700 font-bold">
                {user.score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;

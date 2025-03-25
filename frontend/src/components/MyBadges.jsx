import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { fetchBadgesByUserId } from "../redux/slices/usersSlice";

function MyBadges({ showEmptyState = false }) {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { userBadgesMap } = useSelector((state) => state.users);

  const badges = userBadgesMap[user?.id] || [];

  useEffect(() => {
    if (user?.id && token) {
      dispatch(fetchBadgesByUserId(user.id));
    }
  }, [dispatch, user, token]);

  if (!badges) return <p>Loading badges...</p>;
  if (showEmptyState && badges.length === 0) {
    return (
      <div className="text-center mt-8">
        <div className="text-6xl animate-bounce mb-4">🦸‍♀️</div>
        <h3 className="text-xl font-semibold">No badges... yet!</h3>
        <p className="text-gray-600 mt-2">
          Complete missions, smash goals, and earn your hero status!
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Badges</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="border rounded shadow p-4 flex flex-col items-center bg-white"
          >
            {badge.logoUrl?.startsWith("http") ||
            badge.logoUrl?.startsWith("/uploads") ? (
              <img
                src={
                  badge.logoUrl.startsWith("http")
                    ? badge.logoUrl
                    : import.meta.env.VITE_API_URL + badge.logoUrl
                }
                alt={badge.name}
                className="w-20 h-20 mb-2 object-contain"
              />
            ) : (
              <div className="text-5xl mb-2">{badge.logoUrl}</div>
            )}

            <h3 className="text-lg font-semibold mb-1">{badge.name}</h3>
            <p className="text-sm text-gray-600 mb-1">Type: {badge.type}</p>
            <p className="text-sm text-center text-gray-700">
              {badge.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

MyBadges.propTypes = {
  showEmptyState: PropTypes.bool,
};

export default MyBadges;

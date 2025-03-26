import RevenueOverview from "./RevenueOverview";
import UserBadges from "./UserBadges";
import Badges from "./Badges";

function BadgeManagement() {
  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Badge Management</h1>
      <RevenueOverview />
      <UserBadges />
      <Badges />
    </div>
  );
}

export default BadgeManagement;

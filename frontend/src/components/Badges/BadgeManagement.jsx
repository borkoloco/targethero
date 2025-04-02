import UserBadges from "./UserBadges";
import Badges from "../Badges/Badges";

function BadgeManagement() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 mt-8 space-y-8">
      <h1 className="text-3xl font-extrabold text-[#6e66f3]">
        Badge Management
      </h1>

      <div>
        <UserBadges />
      </div>

      <div>
        <Badges />
      </div>
    </div>
  );
}

export default BadgeManagement;

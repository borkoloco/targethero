import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserStats,
  assignBadgeToUser,
  fetchBadgesByUserId,
  deleteBadgeFromUser,
} from "../../redux/slices/usersSlice";
import ScrollableTable from "../SortableTable/ScrollableTable";
import SortableTableHeader from "../SortableTable/SortableTableHeader";
import ModalWrapper from "../Modal/ModalWrapper";

function UserBadges() {
  const dispatch = useDispatch();
  const { userStats, userBadgesMap } = useSelector((state) => state.users);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const [isAssignModalOpen, setAssignModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [badges, setBadges] = useState([]);
  const [selectedBadgeId, setSelectedBadgeId] = useState(null);

  useEffect(() => {
    dispatch(fetchUserStats());
  }, [dispatch]);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + "/api/badges");
        const data = await res.json();
        setBadges(data);
      } catch (err) {
        console.error("Error fetching badges:", err);
      }
    };
    fetchBadges();
  }, [isAssignModalOpen]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedUsers = [...userStats].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const openAssignModal = (user) => {
    setSelectedUser(user);
    setSelectedBadgeId(null);
    setAssignModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    dispatch(fetchBadgesByUserId(user.id));
    setDeleteModalOpen(true);
  };

  const selectedBadge = badges.find((b) => b.id === Number(selectedBadgeId));

  const handleGiveBadge = () => {
    if (selectedUser && selectedBadgeId) {
      dispatch(
        assignBadgeToUser({ userId: selectedUser.id, badgeId: selectedBadgeId })
      );
      setAssignModalOpen(false);
    }
  };

  const handleDeleteBadgeFromUser = (badgeId) => {
    if (selectedUser) {
      dispatch(deleteBadgeFromUser({ userId: selectedUser.id, badgeId }));
    }
  };

  return (
    <div className="mt-8 p-4 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-[#6e66f3] drop-shadow">
        User Badge Overview
      </h2>
      <ScrollableTable>
        <thead className="sticky top-0 bg-[#fc875e] z-10">
          <tr className="text-white">
            <SortableTableHeader
              label="Name"
              field="name"
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={toggleSort}
            />
            <SortableTableHeader
              label="Missions"
              field="totalMissions"
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={toggleSort}
            />
            <SortableTableHeader
              label="Revenue"
              field="totalRevenue"
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={toggleSort}
            />
            <SortableTableHeader
              label="Clients"
              field="totalClients"
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={toggleSort}
            />
            <SortableTableHeader
              label="Badges"
              field="totalBadges"
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={toggleSort}
            />
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.totalMissions}</td>
              <td className="border p-2">${user.totalRevenue}</td>
              <td className="border p-2">{user.totalClients}</td>
              <td className="border p-2">{user.totalBadges}</td>
              <td className="border p-2 space-x-2">
                <button
                  className="bg-[#6e66f3] hover:bg-[#5a55d1] text-white px-3 py-1 rounded-xl text-sm"
                  onClick={() => openAssignModal(user)}
                >
                  Add Badge
                </button>
                <button
                  className="bg-[#fc875e] hover:bg-[#f67a4f] text-white px-3 py-1 rounded-xl text-sm"
                  onClick={() => openDeleteModal(user)}
                >
                  Delete a Badge
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>

      <ModalWrapper
        isOpen={isAssignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Give Badge to ${selectedUser?.name}`}
      >
        <div className="space-y-4">
          <label className="block">
            Select Badge:
            <select
              className="w-full border rounded p-2 mt-1"
              value={selectedBadgeId || ""}
              onChange={(e) => setSelectedBadgeId(e.target.value)}
            >
              <option value="" disabled>
                Select a badge
              </option>
              {badges.map((badge) => (
                <option key={badge.id} value={badge.id}>
                  {badge.name}
                </option>
              ))}
            </select>
          </label>

          {selectedBadge && (
            <div className="border p-4 rounded bg-gray-50 text-center">
              {selectedBadge.logoUrl?.match(/^https?:\/\//) ||
              selectedBadge.logoUrl?.startsWith("/uploads") ? (
                <img
                  src={
                    selectedBadge.logoUrl.startsWith("http")
                      ? selectedBadge.logoUrl
                      : import.meta.env.VITE_API_URL + selectedBadge.logoUrl
                  }
                  alt={selectedBadge.name}
                  className="w-20 h-20 mx-auto mb-2 object-contain"
                />
              ) : (
                <div className="text-6xl mb-2">{selectedBadge.logoUrl}</div>
              )}
              <p>
                <strong>Type:</strong> {selectedBadge.type}
              </p>
              <p>
                <strong>Description:</strong> {selectedBadge.description}
              </p>
            </div>
          )}

          <button
            onClick={handleGiveBadge}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl w-full"
            disabled={!selectedBadgeId}
          >
            Confirm Assignment
          </button>
        </div>
      </ModalWrapper>

      <ModalWrapper
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={`Delete Badge from ${selectedUser?.name}`}
      >
        <div className="space-y-4">
          {userBadgesMap[selectedUser?.id]?.length > 0 ? (
            <ul className="space-y-2">
              {userBadgesMap[selectedUser.id].map((badge) => (
                <li
                  key={badge.id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span>{badge.name}</span>
                  <button
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this badge?")
                      ) {
                        handleDeleteBadgeFromUser(badge.id);
                      }
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>This user has no badges assigned yet.</p>
          )}
        </div>
      </ModalWrapper>
    </div>
  );
}

export default UserBadges;

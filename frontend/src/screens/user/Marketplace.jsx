import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
<<<<<<<< HEAD:frontend/src/components/Marketplace/Marketplace.jsx
import PurchaseForm from "../Marketplace/PurchaseForm";
import PointsOverview from "../Users/PointsOverview";
import ScrollableTable from "../SortableTable/ScrollableTable";
import SortableTableHeader from "../SortableTable/SortableTableHeader";
========
import PurchaseForm from "../../components/user/PurchaseForm";
import PointsOverview from "../../components/admin/PointsOverview";
import ScrollableTable from "../../components/common/ScrollableTable";
import SortableTableHeader from "../../components/common/SortableTableHeader";
>>>>>>>> d78a76c85fc6a3b61591cd248d296dbf2019b4c9:frontend/src/screens/user/Marketplace.jsx
import { fetchMarketItems } from "../../redux/slices/marketItemsSlice";
import { fetchPurchases } from "../../redux/slices/purchasesSlice";
import { fetchUserProfile } from "../../redux/slices/usersSlice";

function Marketplace() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const items = useSelector((state) => state.marketItems.items);
  const purchases = useSelector((state) => state.purchases.list);
  const [error] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    if (token) {
      dispatch(fetchMarketItems());
      dispatch(fetchPurchases());
      dispatch(fetchUserProfile());
    }
  }, [dispatch, token]);

  const sortedPurchases = [...purchases].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
  });

  const handleSortChange = (field) => {
    setSortField(field);
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const refreshAll = () => {
    dispatch(fetchMarketItems());
    dispatch(fetchPurchases());
    dispatch(fetchUserProfile());
  };

  return (
    <div className="min-h-screen bg-[#f4edf3] p-6 font-sans">
      <h2 className="text-4xl font-extrabold text-[#fc875e] uppercase tracking-wide mb-6 drop-shadow-lg">
        <span className="bg-[#6e66f3] text-white px-3 py-1 rounded-lg shadow-md">
          Marketplace
        </span>
      </h2>

      <div className="mb-8 p-6 bg-white rounded-2xl shadow-xl">
        <PointsOverview />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {items.length === 0 ? (
        <p>No items available at the moment.</p>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">
            Marketplace Products
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden"
              >
                {item.imageUrl && (
                  <div className="h-64 w-full overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-bold text-lg text-[#6e66f3] mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <p className="font-semibold text-[#fc875e] mb-2">
                      Cost: {item.requiredPoints} pts
                    </p>
                    <PurchaseForm
                      itemId={item.id}
                      itemName={item.name}
                      cost={item.requiredPoints}
                      onPurchase={refreshAll}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="p-6 bg-white rounded-2xl shadow-xl">
        <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">My Purchases</h3>
        {sortedPurchases.length === 0 ? (
          <p>You haven’t purchased anything yet.</p>
        ) : (
          <ScrollableTable>
            <thead className="bg-[#fc875e] sticky top-0 z-10">
              <tr className="text-white">
                <SortableTableHeader
                  label="Item"
                  field="item"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSortChange={handleSortChange}
                />
                <SortableTableHeader
                  label="Points Spent"
                  field="points"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSortChange={handleSortChange}
                />
                <SortableTableHeader
                  label="Purchased On"
                  field="createdAt"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSortChange={handleSortChange}
                />
              </tr>
            </thead>
            <tbody>
              {sortedPurchases.map((trade) => (
                <tr key={trade.id}>
                  <td className="border p-2">{trade.item}</td>
                  <td className="border p-2">{trade.points}</td>
                  <td className="border p-2">
                    {new Date(trade.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </ScrollableTable>
        )}
      </div>
    </div>
  );
}

export default Marketplace;

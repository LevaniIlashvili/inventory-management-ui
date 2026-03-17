import { useState, useEffect } from "react";
import type { InventoryDetails } from "../../types/inventoryDetails";
import { searchUsers } from "../../services/userService";
import {
  addUserToAccessList,
  removeUserFromAccessList,
} from "../../services/inventoryService";
import type { User } from "../../types/user";

interface Props {
  inventory: InventoryDetails;
  onUpdateSuccess: () => void;
}

export default function AccessSettingsTab({
  inventory,
  onUpdateSuccess,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchUsers(searchTerm);

        const filteredResults = results.filter(
          (u) =>
            u.id !== inventory.createdBy &&
            !inventory.accessList?.some((a: any) => a.userId === u.id),
        );

        setSearchResults(filteredResults);
      } catch (error) {
        console.error("Failed to search users", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, inventory.accessList, inventory.createdBy]);

  const handleAddUser = async (userId: string) => {
    try {
      setIsAdding(true);
      setErrorMsg(null);

      await addUserToAccessList(inventory.id, userId);

      setSearchTerm("");
      setSearchResults([]);
      onUpdateSuccess();
    } catch (error) {
      console.error("Failed to add user:", error);
      setErrorMsg("Failed to add user to the access list.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (
      !window.confirm("Are you sure you want to remove this user's access?")
    ) {
      return;
    }

    try {
      setRemovingUserId(userId);
      setErrorMsg(null);

      await removeUserFromAccessList(inventory.id, userId);

      onUpdateSuccess();
    } catch (error) {
      console.error("Failed to remove user:", error);
      setErrorMsg("Failed to remove user from the access list.");
    } finally {
      setRemovingUserId(null);
    }
  };

  return (
    <div className="card shadow-sm mt-3">
      <div className="card-body">
        {errorMsg && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {errorMsg}
            <button
              type="button"
              className="btn-close"
              onClick={() => setErrorMsg(null)}
            ></button>
          </div>
        )}

        <div className="row">
          <div className="col-md-6 border-end">
            <h5 className="card-title mb-3">Grant Access</h5>
            <p className="text-muted small">
              Search for users to grant them write access to this inventory.
            </p>

            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Search by username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isAdding}
              />

              {isSearching && (
                <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                  <span className="spinner-border spinner-border-sm text-primary"></span>
                </div>
              )}

              {searchResults.length > 0 && (
                <ul
                  className="list-group position-absolute w-100 shadow mt-1"
                  style={{ zIndex: 1000 }}
                >
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                      onClick={() => handleAddUser(user.id)}
                      disabled={isAdding}
                    >
                      <div className="text-start">
                        <strong>{user.username}</strong>
                        <br />
                        <small className="text-muted">{user.email}</small>
                      </div>
                      <span className="badge bg-primary rounded-pill">
                        {isAdding ? "..." : "+ Add"}
                      </span>
                    </button>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="col-md-6 ps-md-4 mt-4 mt-md-0">
            <h5 className="card-title mb-3">Current Access List</h5>

            {!inventory.accessList || inventory.accessList.length === 0 ? (
              <div className="alert alert-light border text-center text-muted">
                Only the creator currently has access.
              </div>
            ) : (
              <ul className="list-group">
                {inventory.accessList.map((access: any) => (
                  <li
                    key={access.id}
                    className="list-group-item d-flex justify-content-between align-items-center bg-light"
                  >
                    <div>
                      <span className="fw-semibold">
                        {access.user?.username || "User"}
                      </span>
                      {access.user?.email && (
                        <span className="text-muted ms-2 small">
                          ({access.user.email})
                        </span>
                      )}
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger border-0"
                      title="Remove Access"
                      onClick={() => handleRemoveUser(access.userId)}
                      disabled={removingUserId === access.userId}
                    >
                      {removingUserId === access.userId ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        "✕"
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

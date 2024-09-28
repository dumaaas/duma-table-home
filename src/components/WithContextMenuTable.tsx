import { useState, useMemo } from "react";
import { Envelope, Pen, Trash } from "@phosphor-icons/react";
import Pagination from "../components/Pagination/Pagination";
import { faker } from "@faker-js/faker";
import { SortString } from "duma-table/dist/types/TableColumn";
import { BaseTable, TableColumn } from "duma-table";

type User = {
  id: number;
  name: string;
  email: string;
};

const WithContextMenuTable = () => {
  const [sort, setSort] = useState<SortString<User>>("id asc");
  const [skipCount, setSkipCount] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [search, setSearch] = useState<string>("");

  const MyContextMenu = ({ rowData }: { rowData: User }) => {
    return (
      <div
        className="flex flex-col gap-1"
        style={{
          border: "1px solid black",
          background: "white",
          padding: "8px",
        }}
      >
        <p className="text-xs border-b border-b-black">
          Actions for: {rowData.name}
        </p>
        <div className="flex flex-col gap-1 items-start pt-2">
          <div className="flex gap-1 items-center  cursor-pointer hover:text-purple-500">
            <Pen size={12} />
            <p
              className="text-xs cursor-pointer"
              onClick={() => console.log("Edit", rowData)}
            >
              Edit
            </p>
          </div>
          <div className="flex gap-1 items-center cursor-pointer hover:text-purple-500">
            <Trash size={12} />
            <p
              className="text-xs "
              onClick={() => console.log("Edit", rowData)}
            >
              Delete
            </p>
          </div>{" "}
        </div>
      </div>
    );
  };

  const generateRandomUsers = (numUsers: number) => {
    const users = [];
    for (let i = 0; i < numUsers; i++) {
      users.push({
        id: i + 1,
        name: faker.person.fullName(),
        email: faker.internet.email(),
      });
    }
    return users;
  };

  const allUsers = useMemo(() => generateRandomUsers(300), []);

  const sortedUsers = useMemo(() => {
    const sorted = [...allUsers].sort((a, b) => {
      const [key, order] = sort.split(" ") as [keyof User, "asc" | "desc"];
      const modifier = order === "asc" ? 1 : -1;

      if (a[key] < b[key]) return -1 * modifier;
      if (a[key] > b[key]) return 1 * modifier;
      return 0;
    });
    return sorted;
  }, [allUsers, sort]);

  const displayedUsers = sortedUsers
    .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
    .slice(skipCount, skipCount + rowsPerPage);

  return (
    <>
      <input
        type="search"
        placeholder="Search..."
        className="border-purple-500 border rounded-xl px-2 py-0.5 mb-4 bg-transparent text-black focus:outline-none outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <BaseTable
        sort={sort}
        contextComponent={(rowData) => <MyContextMenu rowData={rowData} />}
        onSortChange={(newSort) => {
          setSort(newSort);
        }}
        data={displayedUsers ?? []}
      >
        <TableColumn<User, number>
          name="id"
          label="ID"
          width="*"
          sortable
          valueSelector={(user) => user.id}
          render={(value) => <>{value}</>}
        />
        <TableColumn<User, string>
          name="name"
          label="Person"
          width="*"
          valueSelector={(user) => user.name}
          sortable
          render={(value) => value}
        />
        <TableColumn<User, string>
          name="email"
          label="E-mail"
          width="*"
          valueSelector={(user) => user.email}
          render={(value) => (
            <div className="flex gap-1 items-center text-purple-600 hover:underline">
              <Envelope size={16} />
              <a href={`mailto:${value}`}>{value}</a>
            </div>
          )}
        />
      </BaseTable>
      {displayedUsers && displayedUsers.length > 0 && (
        <Pagination
          skipCount={skipCount}
          totalCount={allUsers.length}
          rowsPerPage={rowsPerPage}
          onSetSkipCount={setSkipCount}
          onRowsPerPage={setRowsPerPage}
        />
      )}
    </>
  );
};

export default WithContextMenuTable;

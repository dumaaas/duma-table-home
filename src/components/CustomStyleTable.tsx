import { useState, useMemo } from "react";
import { Envelope } from "@phosphor-icons/react";
import Pagination from "../components/Pagination/Pagination";
import { faker } from "@faker-js/faker";
import { SortString } from "duma-table/dist/types/TableColumn";
import { BaseTable, TableColumn } from "duma-table";

type User = {
  id: number;
  name: string;
  email: string;
};

const CustomStyleTable = () => {
  const [sort, setSort] = useState<SortString<User>>("id asc");
  const [skipCount, setSkipCount] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [search, setSearch] = useState<string>("");

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
        expandableContent={(rowData) => (
          <div>
            <p>Details for {rowData.name}</p>
            <p>Email: {rowData.email}</p>
          </div>
        )}
        tableClassName="!text-[12px] !uppercase font-extrabold max-w-[30px] !rounded-none !border-4 !border-green-500"
        tableHeadRowClassName="!bg-red-500 !text-white !rounded-none"
        tableBodyRowClassName="!bg-blue-500 odd:!bg-blue-200 hover:!bg-green-500"
        tableExpandableClassName="!bg-yellow-500 !text-red-500 !border-b-[20px] !border-b-purple-500 !border-dashed"
        onSortChange={(newSort) => {
          setSort(newSort);
        }}
        data={displayedUsers ?? []}
      >
        <TableColumn<User, number>
          name="id"
          label="ID"
          width="*"
          valueSelector={(user) => user.id}
          render={(value) => <>{value}</>}
        />
        <TableColumn<User, string>
          name="name"
          label="Person"
          width="*"
          valueSelector={(user) => user.name}
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

export default CustomStyleTable;

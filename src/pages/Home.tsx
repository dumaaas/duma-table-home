import { useState, useMemo } from "react";
import PageWrapper from "../components/PageWrapper/PageWrapper";
import BaseTable from "../components/Table/BaseTable";
import { SortString, TableColumn } from "../components/Table/TableColumn";
import { Envelope, Pen, Trash } from "@phosphor-icons/react";
import Pagination from "../components/Pagination/Pagination";
import { faker } from "@faker-js/faker";

type User = {
  id: number;
  name: string;
  email: string;
};

const Home = () => {
  const [sort, setSort] = useState<SortString<User>>("id asc");
  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  const [skipCount, setSkipCount] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [search, setSearch] = useState<string>("");
  const [showSelectedRows, setShowSelectedRows] = useState<boolean>(false);

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
    <PageWrapper title="Home">
      <>
        <input
          type="search"
          placeholder="Search..."
          className="border-purple-500 border rounded-xl px-2 py-0.5 mb-4 bg-transparent text-black focus:outline-none outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <BaseTable
          hasIndexColumn
          sort={sort}
          expandableContent={(rowData) => (
            <div>
              <p>Details for {rowData.name}</p>
              <p>Email: {rowData.email}</p>
            </div>
          )}
          rowActions={(rowData) => (
            <div className="flex justify-end items-center gap-2">
              <button onClick={() => console.log(rowData)}>
                <Pen className="text-black" />
              </button>
              <button onClick={() => console.log(rowData)}>
                <Trash className="text-red-500"/>
              </button>
            </div>
          )}
          onSortChange={(newSort) => {
            setSort(newSort);
          }}
          selectedRows={selectedRows}
          onRowSelectionChange={setSelectedRows}
          onRowClick={(v) => alert("Row clicked: " + v.name)}
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
            label="Name"
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

        {selectedRows && selectedRows.length > 0 && (
          <div className="absolute right-4 top-16">
            <div
              onClick={() => setShowSelectedRows(!showSelectedRows)}
              className="pt-4 cursor-pointer bg-white border border-black p-4 max-w-fit ml-auto"
            >
              <h3>{showSelectedRows ? "Hide" : "Show"} selected rows</h3>
            </div>
            {showSelectedRows && (
              <div className="bg-white border border-black p-4 mt-1">
                <ul>
                  {selectedRows.map((user, index) => (
                    <li key={user.id}>
                      {index + 1}. {user.name} - {user.email}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </>
    </PageWrapper>
  );
};

export default Home;

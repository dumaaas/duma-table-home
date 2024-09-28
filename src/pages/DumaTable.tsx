import PageWrapper from "../components/PageWrapper/PageWrapper";
import BasicTable from "../components/BasicTable";
import WithIndexTable from "../components/WithIndexTable";
import WithExpandTable from "../components/WithExpandTable";
import WithActionsTable from "../components/WithActionsTable";
import WithRowSelectionTable from "../components/WithRowSelectionTable";
import WithRowClickTable from "../components/WithRowClickTable";
import WithContextMenuTable from "../components/WithContextMenuTable";
import CustomStyleTable from "../components/CustomStyleTable";

const DumaTable = () => {
  return (
    <PageWrapper title="Examples">
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-lg font-bold pb-4 underline underline-offset-2">
            Basic table
          </h2>
          <BasicTable />
        </div>
        <div>
          <h2 className="text-lg font-bold pb-4 underline underline-offset-2">
            Table with index column
          </h2>
          <WithIndexTable />
        </div>
        <div>
          <h2 className="text-lg font-bold pb-4 underline underline-offset-2">
            Table with expandable content
          </h2>
          <WithExpandTable />
        </div>
        <div>
          <h2 className="text-lg font-bold pb-4 underline underline-offset-2">
            Table with row actions
          </h2>
          <WithActionsTable />
        </div>
        <div className="relative z-10">
          <h2 className="text-lg font-bold pb-4 underline underline-offset-2">
            Selectable table
          </h2>
          <WithRowSelectionTable />
        </div>
        <div className="relative">
          <h2 className="text-lg font-bold pb-4 underline underline-offset-2">
            Table with clickable row
          </h2>
          <WithRowClickTable />
        </div>
        <div>
          <h2 className="text-lg font-bold pb-4 underline underline-offset-2">
            Table with context menu
          </h2>
          <WithContextMenuTable />
        </div>
        <div>
          <h2 className="text-lg font-bold pb-4 underline underline-offset-2">
            Table with custom styles
          </h2>
          <CustomStyleTable />
        </div>
      </div>
    </PageWrapper>
  );
};

export default DumaTable;

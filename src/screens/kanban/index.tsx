import styled from "@emotion/styled";
import React from "react";
import { SearchPanel } from "screens/kanban/search-panel";
import { useDocumentTitle } from "utils";
import { useKanBans } from "utils/kanban";
import { KanBanColumn } from "./kanban-column";
import { useKanbanSearchParams, useProjectInUrl } from "./util";

export const KanBanScreen = () => {
  useDocumentTitle("看板列表");
  const { data: currentProject } = useProjectInUrl();
  const { data: kanbans } = useKanBans(useKanbanSearchParams());
  return (
    <div>
      <h1>{currentProject?.name}看板</h1>
      <SearchPanel/>
      <ColumnsContainer>
        {
        kanbans?.map((kanban) => (
          <KanBanColumn kanban={kanban} key={kanban.id} />
          ))
        }
      </ColumnsContainer>
    </div>
  );
};

const ColumnsContainer = styled.div`
  display: flex;
  overflow: hidden;
  margin-right: 2rem;
`;

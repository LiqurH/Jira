import { useProjectIdInUrl } from "screens/kanban/util";



export const useEpicSearchParams = () => ({ projectId: useProjectIdInUrl() }); // 根据url得到看板id

export const useEpicsQueryKey = () => ["epics", useEpicSearchParams()];
import { useLocation } from "react-router-dom";
import { useProject } from "utils/project";
import { useUrlQueryParam } from "utils/url";
import { useMemo  , useCallback} from "react";
import { useTask } from "utils/task";
import { useDebounce } from "utils";

export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  const id = pathname.match(/projects\/(\d+)/)?.[1];
  return Number(id);
};

export const useProjectInUrl = () => useProject(useProjectIdInUrl());

export const useKanbanSearchParams = () => ({ projectId: useProjectIdInUrl() }); // 根据url得到看板id

export const useKanbansQueryKey = () => ["kanbans", useKanbanSearchParams()];

export const useTasksSearchParams = () => {
  const [param, setParam] = useUrlQueryParam([
    "name",
    "typeId",
    "processorId",
    "tagId",
  ]);
  // console.log(param);
  const projectId = useProjectIdInUrl();
  const debouncedName = useDebounce(param.name)
  return useMemo(() => ({ 
    projectId,
    typeId:Number(param.typeId) ||  undefined,
    processorId:Number(param.processorId)  || undefined,
    tagId:Number(param.tagId)  || undefined,
    name:param.name
  }), [projectId, param]);
};

export const useTasksQueryKey = () => ["tasks", useTasksSearchParams()];

export const useTasksModal = () => {
  const [{editingTaskId} ,setEditingTaskId] = useUrlQueryParam(['editingTaskId'])
  const {data:editingTask , isLoading} = useTask(Number(editingTaskId))
  //开启和关闭创建事务模态框的方法
  //使用useCallback ，是因为startEdit等会还要返回出来
  const startEdit = useCallback( (id:number) => {
    setEditingTaskId({editingTaskId:id})
  },[setEditingTaskId])
  const close = useCallback(() => {
    setEditingTaskId({editingTaskId : ''})
  },[setEditingTaskId])

  return {
    editingTaskId,
    editingTask,
    startEdit,
    close,
    isLoading
  }
}
export interface Task {
    id:number;
    name:string;
    processorId:number; //经办人
    projectId:number; //项目
    epicId:number; //任务组
    kanbanId:number; //看板
    typeId:number; //bug or task
    note:string
}
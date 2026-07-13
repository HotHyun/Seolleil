export const taskStatusChangedEvent = "korean-ski:task-status-changed";

export type TaskStatusChangedDetail = {
  taskId: string;
  status: string;
};

export function announceTaskStatusChange(detail: TaskStatusChangedDetail) {
  window.dispatchEvent(new CustomEvent<TaskStatusChangedDetail>(taskStatusChangedEvent, { detail }));
}

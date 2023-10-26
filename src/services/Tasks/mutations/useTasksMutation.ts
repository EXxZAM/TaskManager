import { AXIOS } from "@/config/axios";
import { useMutation } from "react-query";
import { ReactQueryKeys } from "../keys";
import { ITasksRequest, ITasksResponse } from "@/types/api.types";
import { getLatestOrder } from "@services/Tasks";

const fetcher = async (data: ITasksRequest): Promise<ITasksResponse> => {
    const { project, board, ...taskData } = { ...data };

    if (!project) {
        return Promise.reject("Project is undefined");
    }

    const space_id = project.idx;
    const project_id = project.id;
    const board_id = board || 21;

    try {
        const latestOrder = await getLatestOrder(
            Number(space_id),
            Number(project_id)
        );
        taskData.order = latestOrder + 1;

        const API_PATH = `/workspaces/${space_id}/projects/${project_id}/boards/${board_id}/tasks/`;

        const taskResponse = await AXIOS.post(API_PATH, taskData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return taskResponse.data;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const useTasksMutation = () => {
    return useMutation<ITasksResponse, any, ITasksRequest, any>(fetcher, {
        mutationKey: ReactQueryKeys.Tasks,
    });
};

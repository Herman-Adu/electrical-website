"use server";

import type { ProjectStatus } from "@/types/projects";

export interface UpdateProjectInput {
  projectId: string;
  status?: ProjectStatus;
  isFeatured?: boolean;
}

export interface UpdateProjectResult {
  success: boolean;
  message: string;
}

export async function updateProjectListItem(
  input: UpdateProjectInput,
): Promise<UpdateProjectResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (input.projectId.endsWith("3")) {
    return {
      success: false,
      message: "Could not update this project right now. Please retry.",
    };
  }

  return {
    success: true,
    message: "Project updated successfully.",
  };
}

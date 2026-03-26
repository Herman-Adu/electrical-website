"use server";

import type { ProjectStatus } from "@/types/projects";
import { z } from "zod";

const PROJECT_UPDATE_FAILED_MESSAGE =
  "Could not update this project right now. Please retry.";

const updateProjectInputSchema = z.object({
  projectId: z.string().min(1),
  status: z.enum(["planned", "in-progress", "completed"]).optional(),
  isFeatured: z.boolean().optional(),
});

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
  try {
    const parsedInput = updateProjectInputSchema.safeParse(input);
    if (!parsedInput.success) {
      return {
        success: false,
        message: PROJECT_UPDATE_FAILED_MESSAGE,
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 700));

    if (parsedInput.data.projectId.endsWith("3")) {
      return {
        success: false,
        message: PROJECT_UPDATE_FAILED_MESSAGE,
      };
    }

    return {
      success: true,
      message: "Project updated successfully.",
    };
  } catch {
    return {
      success: false,
      message: PROJECT_UPDATE_FAILED_MESSAGE,
    };
  }
}

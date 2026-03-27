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

/**
 * Server Action: Update Project List Item
 *
 * Updates project status or featured flag in the database.
 * Currently implements placeholder behavior with validation.
 *
 * **Validation:**
 * - projectId: Required, non-empty string
 * - status: Optional, must be one of 'planned' | 'in-progress' | 'completed'
 * - isFeatured: Optional boolean flag
 *
 * **Future Implementation:**
 * This action will integrate with a database when the persistence layer is added.
 * It should perform the following before returning success:
 * 1. Verify project exists and is owned by the calling user
 * 2. Update the specified fields in the database
 * 3. Log the change for audit purposes
 * 4. Invalidate relevant caches (Next.js ISR or Vercel KV)
 *
 * @param input - UpdateProjectInput object with projectId and optional status/isFeatured
 * @returns Promise<UpdateProjectResult> - Success boolean with message
 *
 * @throws Never. All errors are caught and return success: false
 *
 * @example
 * const result = await updateProjectListItem({
 *   projectId: 'proj-001',
 *   status: 'completed',
 *   isFeatured: true
 * });
 *
 * if (result.success) {
 *   revalidatePath('/projects');
 * } else {
 *   toast.error(result.message);
 * }
 */
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

import { BaseController } from "arkos/controllers";
import { catchAsync } from "arkos/error-handler";
import type { ArkosRequest, ArkosResponse } from "arkos";
import triageService from "./triage.service";

export class TriageController extends BaseController {
  approve = catchAsync(async (req: ArkosRequest, res: ArkosResponse) => {
    const triage = await triageService.approveTriage(
      req.params.id,
      req.body,
      req.user!.id,
    );
    res.status(200).json({ data: triage });
  });

  reject = catchAsync(async (req: ArkosRequest, res: ArkosResponse) => {
    const triage = await triageService.rejectTriage(
      req.params.id,
      req.user!.id,
      req.body?.rejectionReason,
    );
    res.status(200).json({ data: triage });
  });

  startReview = catchAsync(async (req: ArkosRequest, res: ArkosResponse) => {
    const triage = await triageService.startReview(
      req.params.id,
      req.user!.id,
    );
    res.status(200).json({ data: triage });
  });
}

const triageController = new TriageController("triage");

export default triageController;

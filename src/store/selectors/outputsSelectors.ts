import { createSelector } from "@reduxjs/toolkit";
import { orderBy } from "lodash-es";
import { AppSelector } from "../root";
import { OutputEntity } from "../slices";

const selectA: AppSelector<number> = (state) => state.outputs.currentStep;
const selectB: AppSelector<number> = (state) => state.outputs.totalSteps;

const selectStepProgress = createSelector([selectA, selectB], (a, b) => {
  return a / b;
});

export const selectOrderedEntities: AppSelector<OutputEntity[]> =
  createSelector([(state) => state.outputs.entities], (entities) =>
    orderBy(Object.values(entities), ["createdAt"], ["desc"])
  );

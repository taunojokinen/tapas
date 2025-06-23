export enum ViewMode {
  ShowAll = 0,
  MyMission = 1,
  MyMissionWithAi = 2, // For AI-assisted mission creation
  KeyObjectives = 3,
  KeyObjectivesWithAi = 4,
  KeyObjectivesSelect = 5, // For AI-assisted key objectives creation
  MyTasks = 6,
  MyCurrentState = 7,
}

export enum ImageLoadingState {
  LoadingDescriptions = "LoadingDescriptions",
  PlanningImage = "PlanningImage",
  DrawingImage = "DrawingImage",
  LoadingDone = "LoadingDone"
}
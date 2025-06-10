export enum ViewMode {
  ShowAll = 0,
  MyMission = 1,
  MyMissionWithAi = 2, // For AI-assisted mission creation
  KeyObjectives = 3,
  MyTasks = 4,
  MyCurrentState = 5,
}

export enum ImageLoadingState {
  LoadingDescriptions = "LoadingDescriptions",
  PlanningImage = "PlanningImage",
  DrawingImage = "DrawingImage",
  LoadingDone = "LoadingDone"
}
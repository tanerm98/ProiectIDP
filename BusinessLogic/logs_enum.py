#!/usr/local/bin/python3

from enum import Enum

class Logs(Enum):
    START_1 = "SpringBoard: (FrontBoard) [com.apple.FrontBoard:Common]"
    START_2 = "Received request to open"

    LAUNCHED_1 = "SpringBoard: (SpringBoard) [com.apple.SpringBoard:AppSwitcher] SBMainWorkspaceApplicationSceneLayoutElementViewController-sceneID"
    LAUNCHED_2 = "did end transition to visible YES"

    TIMESTAMP_FORMAT = "%Y-%m-%d %H:%M:%S.%f"
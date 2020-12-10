#include <windows.h>
#include <psapi.h>
#include <stdlib.h>

bool CheckProcess(DWORD processID, int limit) {
  HANDLE hProcess;
  PROCESS_MEMORY_COUNTERS pmc;

  hProcess = OpenProcess(PROCESS_QUERY_INFORMATION |
    PROCESS_VM_READ,
    FALSE, processID);
  if (hProcess == NULL)
    return false;

  bool offender = false;
  WCHAR processName[MAX_PATH] = L"<unknown>";
  HMODULE hMod;
  DWORD cbNeeded;
  SIZE_T memLimit = limit * 1024 * 1024;

  if (EnumProcessModules(hProcess, &hMod, sizeof(hMod), &cbNeeded)) {
    GetModuleBaseName(hProcess, hMod, processName, sizeof(processName) / sizeof(WCHAR));
    if (wcscmp(processName, L"openfin.exe") == 0) {
      if (GetProcessMemoryInfo(hProcess, &pmc, sizeof(pmc))) {
        offender = pmc.WorkingSetSize > memLimit;
      }
    }
  }

  CloseHandle(hProcess);
  return offender;
}

int APIENTRY wWinMain(_In_ HINSTANCE hInstance,
  _In_opt_ HINSTANCE hPrevInstance,
  _In_ LPWSTR    lpCmdLine,
  _In_ int       nCmdShow) {
  MSG msg;
  bool quit = false;
  while (!quit) {
    auto result = MsgWaitForMultipleObjectsEx(0, nullptr, 2000, QS_ALLINPUT, 0);
    if (result == WAIT_OBJECT_0) {
      while (PeekMessage(&msg, nullptr, 0, 0, PM_REMOVE) != FALSE) {
        if (msg.message == WM_QUIT) {
          quit = true;
        }
        TranslateMessage(&msg);
        DispatchMessage(&msg);
      }
    } else if (result == WAIT_TIMEOUT) {
      PostQuitMessage(0);
    }
    else {
      quit = true;
    }
  }
  const int kProcessesMax = 2048;
  DWORD aProcesses[kProcessesMax], cbNeeded, cProcesses;
  int mem_limit = _wtoi(lpCmdLine);

  if (EnumProcesses(aProcesses, sizeof(aProcesses), &cbNeeded)) {
    cProcesses = cbNeeded / sizeof(DWORD);
    for (unsigned int i = 0; i < cProcesses; i++) {
      if (CheckProcess(aProcesses[i], mem_limit)) {
        return 1;
      }
    }
  }
  return 0;
}

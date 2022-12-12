param([int] $dynamicScale = 2, [int] $staticScale = 2)
cd .\ApachePHP
.\build.ps1
cd ..\Express
.\build.ps1
cd ..
.\runScale.ps1 -dynamicScale $dynamicScale -staticScale $staticScale
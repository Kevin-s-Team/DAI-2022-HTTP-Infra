param([int] $dynamicScale = 2, [int] $staticScale = 2)
docker compose up --scale dynamic=$dynamicScale --scale static=$staticScale
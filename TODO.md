#1 chart for stableUnit (DONE)
---
instead of:
```
SU in circulation = 16666.77
Reserve (eth) = 35.00
Reserve ratio = 1.06
REPOs in circulatio = 0.00
SU_DAO_Tokens in circulation = 0.00
```
make a plot of these parameters from the time (ticks).
Two axis: left absolute value in USD (for SU, Reserve, Repos, Shares)
right for ratio \[0..1+\] (Reserve ratio, Parking ratio).
by pointing cursor - in the small bubble should be info about absoulte numbers.


#2 Input generator
---
There are two inputs: `market demand` and `ETH/USD price`.
Right now there are buttons "increase/descrese",
The task is to add drop list with 3 generators:
* None
* random walk
* Geometrical
* Historical data

depends on what is selected, every tick call corresponded method of
`simulation.Market`.


#3 Traders grouping
---
Right now there's long list of traders with individual portfolios.
Make separation of them by groups with total value of portfolios by asserts.
For example:

`Random traders[5] {100400:SU 25:ETH 5:Repo 1:Share}`

and after the the list of them

#3.1 Traders "isActive" switcher
---
Make a checkbox which enable/disable particular group of traders. 
Reflect active/noactive traders with color (like nonactive are grey or something)

#4 Write code of Trader bots on the page
---
Move all Traders classes which extents `class Trader` into
separete file. Print text of this file below `Exchange Simulation`
in a additional block. Make a .js syntax highlight.

#5 Traders buy/sell buttons
---
Right now it's complicated to use, there are 4 input fields etc.
The task is to make it more compact with two fields.
(using non-legacy functions of `Market_SUmETH`)

#6* Add uglify/hidecode modele/pipeline stage for the production build
---
The idea is to hide logic from from potential outsider.
This simulation inevinatebly will leak to our competitiors 
so showing code gives them an advantage which we would like to avoid.

#7* Add logging
---
if simulation in the producation will crash - it would be usefull to get log this info and get notifyed. 
This will help us to see pains of investors and fix it asap.

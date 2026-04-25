# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lessons.spec.ts >> Lesson Library — public >> lesson cards link to individual lesson pages
- Location: tests/e2e/lessons.spec.ts:35:18

# Error details

```
Error: expect(received).toMatch(expected)

Expected pattern: /\/learn\//
Received string:  "/learn"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - navigation [ref=e3]:
      - link "Finly" [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Finly" [ref=e5]:
          - generic [ref=e9]: fin
          - generic [ref=e10]: ly
      - generic [ref=e11]:
        - link "Dashboard" [ref=e12] [cursor=pointer]:
          - /url: /dashboard
        - link "Learn" [ref=e13] [cursor=pointer]:
          - /url: /learn
        - link "Curriculum" [ref=e14] [cursor=pointer]:
          - /url: /curriculum
        - link "Simulator" [ref=e15] [cursor=pointer]:
          - /url: /simulator
        - link "Leaderboard" [ref=e16] [cursor=pointer]:
          - /url: /leaderboard
        - link "Classes" [ref=e17] [cursor=pointer]:
          - /url: /classes
        - link "About" [ref=e18] [cursor=pointer]:
          - /url: /about
      - generic [ref=e19]:
        - generic [ref=e20]:
          - button "8–12" [ref=e21]
          - button "13–17" [ref=e22]
        - link "Login" [ref=e23] [cursor=pointer]:
          - /url: /auth/login
        - link "Sign Up" [ref=e24] [cursor=pointer]:
          - /url: /auth/signup
  - main [ref=e26]:
    - generic [ref=e27]:
      - generic [ref=e28]:
        - generic [ref=e29]:
          - generic [ref=e30]:
            - generic [ref=e31]: Lesson library
            - heading "What do you want to learn?" [level=1] [ref=e32]
            - paragraph [ref=e33]: Search lessons, filter by topic and difficulty, and learn at your pace. Your age tier shapes which lessons appear first.
          - generic [ref=e34]:
            - paragraph [ref=e35]: Age tier
            - paragraph [ref=e36]:
              - text: Showing lessons for
              - strong [ref=e37]: Real World (13–17)
              - text: . Switch anytime from the nav.
        - generic [ref=e38]:
          - img [ref=e39]
          - textbox "Search lessons…" [ref=e42]
      - generic [ref=e44]:
        - button "All" [ref=e45]
        - button "Budgeting" [ref=e46]
        - button "Saving" [ref=e47]
        - button "Investing" [ref=e48]
        - button "Debt & Credit" [ref=e49]
        - button "Banking" [ref=e50]
        - button "Goals" [ref=e51]
        - button "Tax" [ref=e52]
        - combobox [ref=e53]:
          - option "All difficulties" [selected]
          - option "Beginner"
          - option "Intermediate"
          - option "Advanced"
      - generic [ref=e54]:
        - generic [ref=e55]:
          - button "Completed" [ref=e56]
          - button "In Progress" [ref=e57]
          - button "Not Started" [ref=e58]
        - paragraph [ref=e60]: No lessons in progress.
      - generic [ref=e63]:
        - heading "All lessons" [level=2] [ref=e64]
        - paragraph [ref=e65]: 26 lessons match your filters.
      - generic [ref=e66]:
        - link "Banking How Banks Make Money Learn how banks earn from the gap between what they pay savers and charge borrowers. 8 min beginner Interactive Not started 0% Know where your money goes when you deposit it. Start lesson →" [ref=e68] [cursor=pointer]:
          - /url: /learn/how-banks-make-money
          - generic [ref=e71]:
            - generic [ref=e72]:
              - generic [ref=e73]: Banking
              - img [ref=e74]
            - heading "How Banks Make Money" [level=3] [ref=e77]
            - paragraph [ref=e78]: Learn how banks earn from the gap between what they pay savers and charge borrowers.
            - generic [ref=e79]:
              - generic [ref=e80]:
                - img [ref=e81]
                - text: 8 min
              - generic [ref=e84]: beginner
              - generic [ref=e85]:
                - img [ref=e86]
                - text: Interactive
            - generic [ref=e89]:
              - generic [ref=e90]:
                - generic [ref=e91]: Not started
                - generic [ref=e92]: 0%
              - generic [ref=e94]:
                - img [ref=e95]
                - generic [ref=e97]: Know where your money goes when you deposit it.
            - paragraph [ref=e98]: Start lesson →
        - link "Banking Types of Accounts Learn the difference between checking, savings, and money market accounts. 8 min beginner Interactive Not started 0% Know where your money goes when you deposit it. Start lesson →" [ref=e100] [cursor=pointer]:
          - /url: /learn/types-of-accounts
          - generic [ref=e103]:
            - generic [ref=e104]:
              - generic [ref=e105]: Banking
              - img [ref=e106]
            - heading "Types of Accounts" [level=3] [ref=e109]
            - paragraph [ref=e110]: Learn the difference between checking, savings, and money market accounts.
            - generic [ref=e111]:
              - generic [ref=e112]:
                - img [ref=e113]
                - text: 8 min
              - generic [ref=e116]: beginner
              - generic [ref=e117]:
                - img [ref=e118]
                - text: Interactive
            - generic [ref=e121]:
              - generic [ref=e122]:
                - generic [ref=e123]: Not started
                - generic [ref=e124]: 0%
              - generic [ref=e126]:
                - img [ref=e127]
                - generic [ref=e129]: Know where your money goes when you deposit it.
            - paragraph [ref=e130]: Start lesson →
        - link "Banking Banking Fees and Traps Learn how common bank fees add up and how to avoid them. 8 min beginner Interactive Not started 0% Know where your money goes when you deposit it. Start lesson →" [ref=e132] [cursor=pointer]:
          - /url: /learn/banking-fees-and-traps
          - generic [ref=e135]:
            - generic [ref=e136]:
              - generic [ref=e137]: Banking
              - img [ref=e138]
            - heading "Banking Fees and Traps" [level=3] [ref=e141]
            - paragraph [ref=e142]: Learn how common bank fees add up and how to avoid them.
            - generic [ref=e143]:
              - generic [ref=e144]:
                - img [ref=e145]
                - text: 8 min
              - generic [ref=e148]: beginner
              - generic [ref=e149]:
                - img [ref=e150]
                - text: Interactive
            - generic [ref=e153]:
              - generic [ref=e154]:
                - generic [ref=e155]: Not started
                - generic [ref=e156]: 0%
              - generic [ref=e158]:
                - img [ref=e159]
                - generic [ref=e161]: Know where your money goes when you deposit it.
            - paragraph [ref=e162]: Start lesson →
        - link "Banking How Banks Work and What Happens to Your Money Understand deposits, lending, bank profit, and how savings accounts support your goals. 8 min beginner Interactive Not started 0% Know where your money goes when you deposit it. Start lesson →" [ref=e164] [cursor=pointer]:
          - /url: /learn/how-banks-work
          - generic [ref=e167]:
            - generic [ref=e168]:
              - generic [ref=e169]: Banking
              - img [ref=e170]
            - heading "How Banks Work and What Happens to Your Money" [level=3] [ref=e173]
            - paragraph [ref=e174]: Understand deposits, lending, bank profit, and how savings accounts support your goals.
            - generic [ref=e175]:
              - generic [ref=e176]:
                - img [ref=e177]
                - text: 8 min
              - generic [ref=e180]: beginner
              - generic [ref=e181]:
                - img [ref=e182]
                - text: Interactive
            - generic [ref=e185]:
              - generic [ref=e186]:
                - generic [ref=e187]: Not started
                - generic [ref=e188]: 0%
              - generic [ref=e190]:
                - img [ref=e191]
                - generic [ref=e193]: Know where your money goes when you deposit it.
            - paragraph [ref=e194]: Start lesson →
        - link "Banking Digital Banking and Fintech Learn how neobanks and digital wallets work and what security basics matter. 8 min beginner Interactive Not started 0% Know where your money goes when you deposit it. Start lesson →" [ref=e196] [cursor=pointer]:
          - /url: /learn/digital-banking-and-fintech
          - generic [ref=e199]:
            - generic [ref=e200]:
              - generic [ref=e201]: Banking
              - img [ref=e202]
            - heading "Digital Banking and Fintech" [level=3] [ref=e205]
            - paragraph [ref=e206]: Learn how neobanks and digital wallets work and what security basics matter.
            - generic [ref=e207]:
              - generic [ref=e208]:
                - img [ref=e209]
                - text: 8 min
              - generic [ref=e212]: beginner
              - generic [ref=e213]:
                - img [ref=e214]
                - text: Interactive
            - generic [ref=e217]:
              - generic [ref=e218]:
                - generic [ref=e219]: Not started
                - generic [ref=e220]: 0%
              - generic [ref=e222]:
                - img [ref=e223]
                - generic [ref=e225]: Know where your money goes when you deposit it.
            - paragraph [ref=e226]: Start lesson →
        - link "Budgeting The 50/30/20 Rule Learn how to split income between needs, wants, and future goals. 8 min beginner Interactive Not started 0% Plan where money goes before it disappears. Start lesson →" [ref=e228] [cursor=pointer]:
          - /url: /learn/the-50-30-20-rule
          - generic [ref=e231]:
            - generic [ref=e232]:
              - generic [ref=e233]: Budgeting
              - img [ref=e234]
            - heading "The 50/30/20 Rule" [level=3] [ref=e237]
            - paragraph [ref=e238]: Learn how to split income between needs, wants, and future goals.
            - generic [ref=e239]:
              - generic [ref=e240]:
                - img [ref=e241]
                - text: 8 min
              - generic [ref=e244]: beginner
              - generic [ref=e245]:
                - img [ref=e246]
                - text: Interactive
            - generic [ref=e249]:
              - generic [ref=e250]:
                - generic [ref=e251]: Not started
                - generic [ref=e252]: 0%
              - generic [ref=e254]:
                - img [ref=e255]
                - generic [ref=e257]: Plan where money goes before it disappears.
            - paragraph [ref=e258]: Start lesson →
        - link "Budgeting Tracking Your Money Learn how tracking spending changes behaviour and improves decisions. 8 min beginner Interactive Not started 0% Plan where money goes before it disappears. Start lesson →" [ref=e260] [cursor=pointer]:
          - /url: /learn/tracking-your-money
          - generic [ref=e263]:
            - generic [ref=e264]:
              - generic [ref=e265]: Budgeting
              - img [ref=e266]
            - heading "Tracking Your Money" [level=3] [ref=e269]
            - paragraph [ref=e270]: Learn how tracking spending changes behaviour and improves decisions.
            - generic [ref=e271]:
              - generic [ref=e272]:
                - img [ref=e273]
                - text: 8 min
              - generic [ref=e276]: beginner
              - generic [ref=e277]:
                - img [ref=e278]
                - text: Interactive
            - generic [ref=e281]:
              - generic [ref=e282]:
                - generic [ref=e283]: Not started
                - generic [ref=e284]: 0%
              - generic [ref=e286]:
                - img [ref=e287]
                - generic [ref=e289]: Plan where money goes before it disappears.
            - paragraph [ref=e290]: Start lesson →
        - link "Budgeting Irregular Income Learn how to budget when your income changes from month to month. 8 min beginner Interactive Not started 0% Plan where money goes before it disappears. Start lesson →" [ref=e292] [cursor=pointer]:
          - /url: /learn/irregular-income
          - generic [ref=e295]:
            - generic [ref=e296]:
              - generic [ref=e297]: Budgeting
              - img [ref=e298]
            - heading "Irregular Income" [level=3] [ref=e301]
            - paragraph [ref=e302]: Learn how to budget when your income changes from month to month.
            - generic [ref=e303]:
              - generic [ref=e304]:
                - img [ref=e305]
                - text: 8 min
              - generic [ref=e308]: beginner
              - generic [ref=e309]:
                - img [ref=e310]
                - text: Interactive
            - generic [ref=e313]:
              - generic [ref=e314]:
                - generic [ref=e315]: Not started
                - generic [ref=e316]: 0%
              - generic [ref=e318]:
                - img [ref=e319]
                - generic [ref=e321]: Plan where money goes before it disappears.
            - paragraph [ref=e322]: Start lesson →
        - link "Budgeting Your First Paycheck Learn how to read a payslip and understand why take-home pay is lower than expected. 8 min beginner Interactive Not started 0% Plan where money goes before it disappears. Start lesson →" [ref=e324] [cursor=pointer]:
          - /url: /learn/your-first-paycheck
          - generic [ref=e327]:
            - generic [ref=e328]:
              - generic [ref=e329]: Budgeting
              - img [ref=e330]
            - heading "Your First Paycheck" [level=3] [ref=e333]
            - paragraph [ref=e334]: Learn how to read a payslip and understand why take-home pay is lower than expected.
            - generic [ref=e335]:
              - generic [ref=e336]:
                - img [ref=e337]
                - text: 8 min
              - generic [ref=e340]: beginner
              - generic [ref=e341]:
                - img [ref=e342]
                - text: Interactive
            - generic [ref=e345]:
              - generic [ref=e346]:
                - generic [ref=e347]: Not started
                - generic [ref=e348]: 0%
              - generic [ref=e350]:
                - img [ref=e351]
                - generic [ref=e353]: Plan where money goes before it disappears.
            - paragraph [ref=e354]: Start lesson →
        - link "Budgeting Budgeting for a Goal Learn how to work backward from a goal and build a budget that gets you there. 8 min beginner Interactive Not started 0% Plan where money goes before it disappears. Start lesson →" [ref=e356] [cursor=pointer]:
          - /url: /learn/budgeting-for-a-goal
          - generic [ref=e359]:
            - generic [ref=e360]:
              - generic [ref=e361]: Budgeting
              - img [ref=e362]
            - heading "Budgeting for a Goal" [level=3] [ref=e365]
            - paragraph [ref=e366]: Learn how to work backward from a goal and build a budget that gets you there.
            - generic [ref=e367]:
              - generic [ref=e368]:
                - img [ref=e369]
                - text: 8 min
              - generic [ref=e372]: beginner
              - generic [ref=e373]:
                - img [ref=e374]
                - text: Interactive
            - generic [ref=e377]:
              - generic [ref=e378]:
                - generic [ref=e379]: Not started
                - generic [ref=e380]: 0%
              - generic [ref=e382]:
                - img [ref=e383]
                - generic [ref=e385]: Plan where money goes before it disappears.
            - paragraph [ref=e386]: Start lesson →
        - link "Debt What Is Debt? Learn what borrowing means, when debt can help, and when it creates problems. 8 min beginner Interactive Not started 0% Understand borrowing before it controls your choices. Start lesson →" [ref=e388] [cursor=pointer]:
          - /url: /learn/what-is-debt
          - generic [ref=e391]:
            - generic [ref=e392]:
              - generic [ref=e393]: Debt
              - img [ref=e394]
            - heading "What Is Debt?" [level=3] [ref=e397]
            - paragraph [ref=e398]: Learn what borrowing means, when debt can help, and when it creates problems.
            - generic [ref=e399]:
              - generic [ref=e400]:
                - img [ref=e401]
                - text: 8 min
              - generic [ref=e404]: beginner
              - generic [ref=e405]:
                - img [ref=e406]
                - text: Interactive
            - generic [ref=e409]:
              - generic [ref=e410]:
                - generic [ref=e411]: Not started
                - generic [ref=e412]: 0%
              - generic [ref=e414]:
                - img [ref=e415]
                - generic [ref=e417]: Understand borrowing before it controls your choices.
            - paragraph [ref=e418]: Start lesson →
        - link "Debt Credit Scores Explained Learn what a credit score measures and why it changes real-world options. 8 min beginner Interactive Not started 0% Understand borrowing before it controls your choices. Start lesson →" [ref=e420] [cursor=pointer]:
          - /url: /learn/credit-scores-explained
          - generic [ref=e423]:
            - generic [ref=e424]:
              - generic [ref=e425]: Debt
              - img [ref=e426]
            - heading "Credit Scores Explained" [level=3] [ref=e429]
            - paragraph [ref=e430]: Learn what a credit score measures and why it changes real-world options.
            - generic [ref=e431]:
              - generic [ref=e432]:
                - img [ref=e433]
                - text: 8 min
              - generic [ref=e436]: beginner
              - generic [ref=e437]:
                - img [ref=e438]
                - text: Interactive
            - generic [ref=e441]:
              - generic [ref=e442]:
                - generic [ref=e443]: Not started
                - generic [ref=e444]: 0%
              - generic [ref=e446]:
                - img [ref=e447]
                - generic [ref=e449]: Understand borrowing before it controls your choices.
            - paragraph [ref=e450]: Start lesson →
        - 'link "Debt Credit Cards: How They Work Learn why credit cards are loans and why minimum payments cost so much. 8 min beginner Interactive Not started 0% Understand borrowing before it controls your choices. Start lesson →" [ref=e452] [cursor=pointer]':
          - /url: /learn/credit-cards-how-they-work
          - generic [ref=e455]:
            - generic [ref=e456]:
              - generic [ref=e457]: Debt
              - img [ref=e458]
            - 'heading "Credit Cards: How They Work" [level=3] [ref=e461]'
            - paragraph [ref=e462]: Learn why credit cards are loans and why minimum payments cost so much.
            - generic [ref=e463]:
              - generic [ref=e464]:
                - img [ref=e465]
                - text: 8 min
              - generic [ref=e468]: beginner
              - generic [ref=e469]:
                - img [ref=e470]
                - text: Interactive
            - generic [ref=e473]:
              - generic [ref=e474]:
                - generic [ref=e475]: Not started
                - generic [ref=e476]: 0%
              - generic [ref=e478]:
                - img [ref=e479]
                - generic [ref=e481]: Understand borrowing before it controls your choices.
            - paragraph [ref=e482]: Start lesson →
        - link "Debt Student Loans and Education Debt Learn how student loans work and how to think about education as an investment. 8 min intermediate Interactive Not started 0% Understand borrowing before it controls your choices. Start lesson →" [ref=e484] [cursor=pointer]:
          - /url: /learn/student-loans-and-education-debt
          - generic [ref=e487]:
            - generic [ref=e488]:
              - generic [ref=e489]: Debt
              - img [ref=e490]
            - heading "Student Loans and Education Debt" [level=3] [ref=e493]
            - paragraph [ref=e494]: Learn how student loans work and how to think about education as an investment.
            - generic [ref=e495]:
              - generic [ref=e496]:
                - img [ref=e497]
                - text: 8 min
              - generic [ref=e500]: intermediate
              - generic [ref=e501]:
                - img [ref=e502]
                - text: Interactive
            - generic [ref=e505]:
              - generic [ref=e506]:
                - generic [ref=e507]: Not started
                - generic [ref=e508]: 0%
              - generic [ref=e510]:
                - img [ref=e511]
                - generic [ref=e513]: Understand borrowing before it controls your choices.
            - paragraph [ref=e514]: Start lesson →
        - link "Debt Getting Out of Debt Learn practical payoff strategies and why extra payments change the math. 8 min beginner Interactive Not started 0% Understand borrowing before it controls your choices. Start lesson →" [ref=e516] [cursor=pointer]:
          - /url: /learn/getting-out-of-debt
          - generic [ref=e519]:
            - generic [ref=e520]:
              - generic [ref=e521]: Debt
              - img [ref=e522]
            - heading "Getting Out of Debt" [level=3] [ref=e525]
            - paragraph [ref=e526]: Learn practical payoff strategies and why extra payments change the math.
            - generic [ref=e527]:
              - generic [ref=e528]:
                - img [ref=e529]
                - text: 8 min
              - generic [ref=e532]: beginner
              - generic [ref=e533]:
                - img [ref=e534]
                - text: Interactive
            - generic [ref=e537]:
              - generic [ref=e538]:
                - generic [ref=e539]: Not started
                - generic [ref=e540]: 0%
              - generic [ref=e542]:
                - img [ref=e543]
                - generic [ref=e545]: Understand borrowing before it controls your choices.
            - paragraph [ref=e546]: Start lesson →
        - link "Investing What Is Investing? Learn how investing differs from saving and why inflation matters. 8 min beginner Interactive Not started 0% Learn growth, risk, and long-term thinking. Start lesson →" [ref=e548] [cursor=pointer]:
          - /url: /learn/what-is-investing
          - generic [ref=e551]:
            - generic [ref=e552]:
              - generic [ref=e553]: Investing
              - img [ref=e554]
            - heading "What Is Investing?" [level=3] [ref=e557]
            - paragraph [ref=e558]: Learn how investing differs from saving and why inflation matters.
            - generic [ref=e559]:
              - generic [ref=e560]:
                - img [ref=e561]
                - text: 8 min
              - generic [ref=e564]: beginner
              - generic [ref=e565]:
                - img [ref=e566]
                - text: Interactive
            - generic [ref=e569]:
              - generic [ref=e570]:
                - generic [ref=e571]: Not started
                - generic [ref=e572]: 0%
              - generic [ref=e574]:
                - img [ref=e575]
                - generic [ref=e577]: Learn growth, risk, and long-term thinking.
            - paragraph [ref=e578]: Start lesson →
        - link "Investing Stocks, Bonds, and Funds Learn the basics of ownership, lending, and diversified funds. 8 min beginner Interactive Not started 0% Learn growth, risk, and long-term thinking. Start lesson →" [ref=e580] [cursor=pointer]:
          - /url: /learn/stocks-bonds-and-funds
          - generic [ref=e583]:
            - generic [ref=e584]:
              - generic [ref=e585]: Investing
              - img [ref=e586]
            - heading "Stocks, Bonds, and Funds" [level=3] [ref=e589]
            - paragraph [ref=e590]: Learn the basics of ownership, lending, and diversified funds.
            - generic [ref=e591]:
              - generic [ref=e592]:
                - img [ref=e593]
                - text: 8 min
              - generic [ref=e596]: beginner
              - generic [ref=e597]:
                - img [ref=e598]
                - text: Interactive
            - generic [ref=e601]:
              - generic [ref=e602]:
                - generic [ref=e603]: Not started
                - generic [ref=e604]: 0%
              - generic [ref=e606]:
                - img [ref=e607]
                - generic [ref=e609]: Learn growth, risk, and long-term thinking.
            - paragraph [ref=e610]: Start lesson →
        - link "Investing Risk and Return Learn why higher return usually means higher uncertainty and why diversification helps. 8 min intermediate Interactive Not started 0% Learn growth, risk, and long-term thinking. Start lesson →" [ref=e612] [cursor=pointer]:
          - /url: /learn/risk-and-return
          - generic [ref=e615]:
            - generic [ref=e616]:
              - generic [ref=e617]: Investing
              - img [ref=e618]
            - heading "Risk and Return" [level=3] [ref=e621]
            - paragraph [ref=e622]: Learn why higher return usually means higher uncertainty and why diversification helps.
            - generic [ref=e623]:
              - generic [ref=e624]:
                - img [ref=e625]
                - text: 8 min
              - generic [ref=e628]: intermediate
              - generic [ref=e629]:
                - img [ref=e630]
                - text: Interactive
            - generic [ref=e633]:
              - generic [ref=e634]:
                - generic [ref=e635]: Not started
                - generic [ref=e636]: 0%
              - generic [ref=e638]:
                - img [ref=e639]
                - generic [ref=e641]: Learn growth, risk, and long-term thinking.
            - paragraph [ref=e642]: Start lesson →
        - link "Investing Starting to Invest as a Teen Learn what investing options teens can use and why early starts are powerful. 8 min beginner Interactive Not started 0% Learn growth, risk, and long-term thinking. Start lesson →" [ref=e644] [cursor=pointer]:
          - /url: /learn/starting-to-invest-as-a-teen
          - generic [ref=e647]:
            - generic [ref=e648]:
              - generic [ref=e649]: Investing
              - img [ref=e650]
            - heading "Starting to Invest as a Teen" [level=3] [ref=e653]
            - paragraph [ref=e654]: Learn what investing options teens can use and why early starts are powerful.
            - generic [ref=e655]:
              - generic [ref=e656]:
                - img [ref=e657]
                - text: 8 min
              - generic [ref=e660]: beginner
              - generic [ref=e661]:
                - img [ref=e662]
                - text: Interactive
            - generic [ref=e665]:
              - generic [ref=e666]:
                - generic [ref=e667]: Not started
                - generic [ref=e668]: 0%
              - generic [ref=e670]:
                - img [ref=e671]
                - generic [ref=e673]: Learn growth, risk, and long-term thinking.
            - paragraph [ref=e674]: Start lesson →
        - link "Saving Emergency Funds Learn why emergencies need cash savings and how to build a buffer on a small income. 8 min beginner Interactive Not started 0% Turn small habits into future freedom. Start lesson →" [ref=e676] [cursor=pointer]:
          - /url: /learn/emergency-funds
          - generic [ref=e679]:
            - generic [ref=e680]:
              - generic [ref=e681]: Saving
              - img [ref=e682]
            - heading "Emergency Funds" [level=3] [ref=e685]
            - paragraph [ref=e686]: Learn why emergencies need cash savings and how to build a buffer on a small income.
            - generic [ref=e687]:
              - generic [ref=e688]:
                - img [ref=e689]
                - text: 8 min
              - generic [ref=e692]: beginner
              - generic [ref=e693]:
                - img [ref=e694]
                - text: Interactive
            - generic [ref=e697]:
              - generic [ref=e698]:
                - generic [ref=e699]: Not started
                - generic [ref=e700]: 0%
              - generic [ref=e702]:
                - img [ref=e703]
                - generic [ref=e705]: Turn small habits into future freedom.
            - paragraph [ref=e706]: Start lesson →
        - link "Saving Short vs Long-Term Goals Learn how time horizon changes the way you save and spend. 8 min beginner Interactive Not started 0% Turn small habits into future freedom. Start lesson →" [ref=e708] [cursor=pointer]:
          - /url: /learn/short-vs-long-term-goals
          - generic [ref=e711]:
            - generic [ref=e712]:
              - generic [ref=e713]: Saving
              - img [ref=e714]
            - heading "Short vs Long-Term Goals" [level=3] [ref=e717]
            - paragraph [ref=e718]: Learn how time horizon changes the way you save and spend.
            - generic [ref=e719]:
              - generic [ref=e720]:
                - img [ref=e721]
                - text: 8 min
              - generic [ref=e724]: beginner
              - generic [ref=e725]:
                - img [ref=e726]
                - text: Interactive
            - generic [ref=e729]:
              - generic [ref=e730]:
                - generic [ref=e731]: Not started
                - generic [ref=e732]: 0%
              - generic [ref=e734]:
                - img [ref=e735]
                - generic [ref=e737]: Turn small habits into future freedom.
            - paragraph [ref=e738]: Start lesson →
        - link "Saving Compound Interest Learn how compound growth works and why starting early matters so much. 8 min intermediate Interactive Not started 0% Turn small habits into future freedom. Start lesson →" [ref=e740] [cursor=pointer]:
          - /url: /learn/compound-interest
          - generic [ref=e743]:
            - generic [ref=e744]:
              - generic [ref=e745]: Saving
              - img [ref=e746]
            - heading "Compound Interest" [level=3] [ref=e749]
            - paragraph [ref=e750]: Learn how compound growth works and why starting early matters so much.
            - generic [ref=e751]:
              - generic [ref=e752]:
                - img [ref=e753]
                - text: 8 min
              - generic [ref=e756]: intermediate
              - generic [ref=e757]:
                - img [ref=e758]
                - text: Interactive
            - generic [ref=e761]:
              - generic [ref=e762]:
                - generic [ref=e763]: Not started
                - generic [ref=e764]: 0%
              - generic [ref=e766]:
                - img [ref=e767]
                - generic [ref=e769]: Turn small habits into future freedom.
            - paragraph [ref=e770]: Start lesson →
        - link "Saving Savings Accounts and Interest Learn how APY works, how to compare accounts, and why inflation matters. 8 min beginner Interactive Not started 0% Turn small habits into future freedom. Start lesson →" [ref=e772] [cursor=pointer]:
          - /url: /learn/savings-accounts-and-interest
          - generic [ref=e775]:
            - generic [ref=e776]:
              - generic [ref=e777]: Saving
              - img [ref=e778]
            - heading "Savings Accounts and Interest" [level=3] [ref=e781]
            - paragraph [ref=e782]: Learn how APY works, how to compare accounts, and why inflation matters.
            - generic [ref=e783]:
              - generic [ref=e784]:
                - img [ref=e785]
                - text: 8 min
              - generic [ref=e788]: beginner
              - generic [ref=e789]:
                - img [ref=e790]
                - text: Interactive
            - generic [ref=e793]:
              - generic [ref=e794]:
                - generic [ref=e795]: Not started
                - generic [ref=e796]: 0%
              - generic [ref=e798]:
                - img [ref=e799]
                - generic [ref=e801]: Turn small habits into future freedom.
            - paragraph [ref=e802]: Start lesson →
        - link "Saving The Pay Yourself First Method Learn why automatic saving beats relying on willpower every month. 8 min beginner Interactive Not started 0% Turn small habits into future freedom. Start lesson →" [ref=e804] [cursor=pointer]:
          - /url: /learn/the-pay-yourself-first-method
          - generic [ref=e807]:
            - generic [ref=e808]:
              - generic [ref=e809]: Saving
              - img [ref=e810]
            - heading "The Pay Yourself First Method" [level=3] [ref=e813]
            - paragraph [ref=e814]: Learn why automatic saving beats relying on willpower every month.
            - generic [ref=e815]:
              - generic [ref=e816]:
                - img [ref=e817]
                - text: 8 min
              - generic [ref=e820]: beginner
              - generic [ref=e821]:
                - img [ref=e822]
                - text: Interactive
            - generic [ref=e825]:
              - generic [ref=e826]:
                - generic [ref=e827]: Not started
                - generic [ref=e828]: 0%
              - generic [ref=e830]:
                - img [ref=e831]
                - generic [ref=e833]: Turn small habits into future freedom.
            - paragraph [ref=e834]: Start lesson →
        - link "Tax Understanding Your Income Learn the main ways people earn money and how to compare earning options. 8 min beginner Interactive Not started 0% Understand deductions, payslips, and public services. Start lesson →" [ref=e836] [cursor=pointer]:
          - /url: /learn/understanding-your-income
          - generic [ref=e839]:
            - generic [ref=e840]:
              - generic [ref=e841]: Tax
              - img [ref=e842]
            - heading "Understanding Your Income" [level=3] [ref=e845]
            - paragraph [ref=e846]: Learn the main ways people earn money and how to compare earning options.
            - generic [ref=e847]:
              - generic [ref=e848]:
                - img [ref=e849]
                - text: 8 min
              - generic [ref=e852]: beginner
              - generic [ref=e853]:
                - img [ref=e854]
                - text: Interactive
            - generic [ref=e857]:
              - generic [ref=e858]:
                - generic [ref=e859]: Not started
                - generic [ref=e860]: 0%
              - generic [ref=e862]:
                - img [ref=e863]
                - generic [ref=e865]: Understand deductions, payslips, and public services.
            - paragraph [ref=e866]: Start lesson →
        - link "Tax Taxes and Why They Exist Learn what taxes pay for and how income tax works at a basic level. 8 min beginner Interactive Not started 0% Understand deductions, payslips, and public services. Start lesson →" [ref=e868] [cursor=pointer]:
          - /url: /learn/taxes-and-why-they-exist
          - generic [ref=e871]:
            - generic [ref=e872]:
              - generic [ref=e873]: Tax
              - img [ref=e874]
            - heading "Taxes and Why They Exist" [level=3] [ref=e877]
            - paragraph [ref=e878]: Learn what taxes pay for and how income tax works at a basic level.
            - generic [ref=e879]:
              - generic [ref=e880]:
                - img [ref=e881]
                - text: 8 min
              - generic [ref=e884]: beginner
              - generic [ref=e885]:
                - img [ref=e886]
                - text: Interactive
            - generic [ref=e889]:
              - generic [ref=e890]:
                - generic [ref=e891]: Not started
                - generic [ref=e892]: 0%
              - generic [ref=e894]:
                - img [ref=e895]
                - generic [ref=e897]: Understand deductions, payslips, and public services.
            - paragraph [ref=e898]: Start lesson →
  - contentinfo [ref=e899]:
    - generic [ref=e900]:
      - generic [ref=e901]:
        - img "Finly" [ref=e902]:
          - generic [ref=e906]: fin
          - generic [ref=e907]: ly
        - paragraph [ref=e908]: Financial education for the next generation.
      - navigation [ref=e909]:
        - link "Learn" [ref=e910] [cursor=pointer]:
          - /url: /learn
        - link "Curriculum" [ref=e911] [cursor=pointer]:
          - /url: /curriculum
        - link "About" [ref=e912] [cursor=pointer]:
          - /url: /about
        - link "Privacy" [ref=e913] [cursor=pointer]:
          - /url: /privacy
      - paragraph [ref=e914]: 100% free, always
  - button "Open Next.js Dev Tools" [ref=e920] [cursor=pointer]:
    - img [ref=e921]
```

# Test source

```ts
  1   | /**
  2   |  * Lesson Library and completion flow tests.
  3   |  * Covers: lesson library renders, filtering by topic/tier, lesson page loads,
  4   |  * lesson completion API awards XP, quiz API tracks answers.
  5   |  */
  6   | 
  7   | import { test, expect } from "@playwright/test";
  8   | import {
  9   |   createTestUser,
  10  |   deleteTestUser,
  11  |   getUserProfile,
  12  | } from "../helpers/supabase-admin";
  13  | import { loginViaUI, uniqueEmail } from "../helpers/auth";
  14  | import * as dotenv from "dotenv";
  15  | import path from "path";
  16  | 
  17  | dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });
  18  | 
  19  | const TEST_PASSWORD = "TestPass1!";
  20  | 
  21  | test.describe("Lesson Library — public", () => {
  22  |   test("/learn page renders lesson cards or empty state", async ({ page }) => {
  23  |     await page.goto("/learn");
  24  |     await expect(page.getByRole("heading").first()).toBeVisible();
  25  |   });
  26  | 
  27  |   test("lesson library shows topic filter options", async ({ page }) => {
  28  |     await page.goto("/learn");
  29  |     await expect(
  30  |       page.getByText(/budgeting|saving|investing|banking|all/i).first()
  31  |     ).toBeVisible({ timeout: 8_000 });
  32  |   });
  33  | 
  34  |   test("lesson cards link to individual lesson pages", async ({ page }) => {
  35  |     await page.goto("/learn");
  36  | 
  37  |     // Find first lesson card link
  38  |     const lessonLink = page.getByRole("link").filter({ hasText: /learn|read|start|lesson/i }).first();
  39  |     if (await lessonLink.isVisible({ timeout: 3_000 }).catch(() => false)) {
  40  |       const href = await lessonLink.getAttribute("href");
  41  |       expect(href).toMatch(/\/learn\//);
  42  |     }
  43  |   });
  44  | });
  45  | 
  46  | test.describe("Lesson completion API", () => {
  47  |   let userId: string;
> 48  |   let email: string;
      |                               ^ Error: expect(received).toMatch(expected)
  49  | 
  50  |   test.beforeAll(async () => {
  51  |     email = uniqueEmail("lesson");
  52  |     const user = await createTestUser(email, TEST_PASSWORD, "LessonTester");
  53  |     userId = user.id;
  54  |   });
  55  | 
  56  |   test.afterAll(async () => {
  57  |     await deleteTestUser(userId);
  58  |   });
  59  | 
  60  |   test("POST /api/lesson-complete requires authentication", async ({ page }) => {
  61  |     const response = await page.request.post("/api/lesson-complete", {
  62  |       data: { slug: "needs-vs-wants", timeSpent: 120 },
  63  |     });
  64  |     expect(response.status()).toBe(401);
  65  |   });
  66  | 
  67  |   test("POST /api/lesson-complete requires lessonId and slug — returns 400 without them", async ({
  68  |     page,
  69  |   }) => {
  70  |     await loginViaUI(page, email, TEST_PASSWORD);
  71  | 
  72  |     const response = await page.request.post("/api/lesson-complete", {
  73  |       data: { slug: "needs-vs-wants" }, // missing lessonId
  74  |     });
  75  |     expect(response.status()).toBe(400);
  76  |   });
  77  | 
  78  |   test("quiz-result API requires authentication", async ({ page }) => {
  79  |     const response = await page.request.get(
  80  |       "/api/quiz-result?slug=needs-vs-wants&questionIndex=0&answer=0"
  81  |     );
  82  |     expect(response.status()).toBe(401);
  83  |   });
  84  | 
  85  |   test("lesson progress API returns lesson_progress rows for authenticated user", async ({ page }) => {
  86  |     await loginViaUI(page, email, TEST_PASSWORD);
  87  | 
  88  |     // Mark a lesson as in-progress via lesson-complete or direct check
  89  |     const profileRes = await page.request.get("/api/profile");
  90  |     expect(profileRes.status()).toBe(200);
  91  |   });
  92  | });
  93  | 
  94  | test.describe("Individual lesson pages", () => {
  95  |   test("a known lesson page renders content", async ({ page }) => {
  96  |     // Try to load a lesson that's likely to exist
  97  |     await page.goto("/learn/needs-vs-wants");
  98  |     // Either 404 or lesson content renders
  99  |     const status = await page.evaluate(() => document.title);
  100 |     // Not testing specific content since lessons depend on DB/files
  101 |     expect(status).toBeTruthy();
  102 |   });
  103 | 
  104 |   test("lesson page does not redirect to login when accessed as guest", async ({ page }) => {
  105 |     await page.goto("/learn");
  106 |     await expect(page).not.toHaveURL(/\/auth\/login/);
  107 |   });
  108 | });
  109 | 
```
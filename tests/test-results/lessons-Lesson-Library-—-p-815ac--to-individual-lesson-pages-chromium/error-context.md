# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lessons.spec.ts >> Lesson Library — public >> lesson cards link to individual lesson pages
- Location: tests/e2e/lessons.spec.ts:34:7

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
      - generic [ref=e56]:
        - heading "All lessons" [level=2] [ref=e57]
        - paragraph [ref=e58]: 26 lessons match your filters.
      - generic [ref=e59]:
        - link "Banking How Banks Make Money Learn how banks earn from the gap between what they pay savers and charge borrowers. 8 min beginner Interactive Not started 0% Know where your money goes when you deposit it. Start lesson →" [ref=e61] [cursor=pointer]:
          - /url: /learn/how-banks-make-money
          - generic [ref=e64]:
            - generic [ref=e65]:
              - generic [ref=e66]: Banking
              - img [ref=e67]
            - heading "How Banks Make Money" [level=3] [ref=e70]
            - paragraph [ref=e71]: Learn how banks earn from the gap between what they pay savers and charge borrowers.
            - generic [ref=e72]:
              - generic [ref=e73]:
                - img [ref=e74]
                - text: 8 min
              - generic [ref=e77]: beginner
              - generic [ref=e78]:
                - img [ref=e79]
                - text: Interactive
            - generic [ref=e82]:
              - generic [ref=e83]:
                - generic [ref=e84]: Not started
                - generic [ref=e85]: 0%
              - generic [ref=e87]:
                - img [ref=e88]
                - generic [ref=e90]: Know where your money goes when you deposit it.
            - paragraph [ref=e91]: Start lesson →
        - link "Banking Types of Accounts Learn the difference between checking, savings, and money market accounts. 8 min beginner Interactive Not started 0% Know where your money goes when you deposit it. Start lesson →" [ref=e93] [cursor=pointer]:
          - /url: /learn/types-of-accounts
          - generic [ref=e96]:
            - generic [ref=e97]:
              - generic [ref=e98]: Banking
              - img [ref=e99]
            - heading "Types of Accounts" [level=3] [ref=e102]
            - paragraph [ref=e103]: Learn the difference between checking, savings, and money market accounts.
            - generic [ref=e104]:
              - generic [ref=e105]:
                - img [ref=e106]
                - text: 8 min
              - generic [ref=e109]: beginner
              - generic [ref=e110]:
                - img [ref=e111]
                - text: Interactive
            - generic [ref=e114]:
              - generic [ref=e115]:
                - generic [ref=e116]: Not started
                - generic [ref=e117]: 0%
              - generic [ref=e119]:
                - img [ref=e120]
                - generic [ref=e122]: Know where your money goes when you deposit it.
            - paragraph [ref=e123]: Start lesson →
        - link "Banking Banking Fees and Traps Learn how common bank fees add up and how to avoid them. 8 min beginner Interactive Not started 0% Know where your money goes when you deposit it. Start lesson →" [ref=e125] [cursor=pointer]:
          - /url: /learn/banking-fees-and-traps
          - generic [ref=e128]:
            - generic [ref=e129]:
              - generic [ref=e130]: Banking
              - img [ref=e131]
            - heading "Banking Fees and Traps" [level=3] [ref=e134]
            - paragraph [ref=e135]: Learn how common bank fees add up and how to avoid them.
            - generic [ref=e136]:
              - generic [ref=e137]:
                - img [ref=e138]
                - text: 8 min
              - generic [ref=e141]: beginner
              - generic [ref=e142]:
                - img [ref=e143]
                - text: Interactive
            - generic [ref=e146]:
              - generic [ref=e147]:
                - generic [ref=e148]: Not started
                - generic [ref=e149]: 0%
              - generic [ref=e151]:
                - img [ref=e152]
                - generic [ref=e154]: Know where your money goes when you deposit it.
            - paragraph [ref=e155]: Start lesson →
        - link "Banking How Banks Work and What Happens to Your Money Understand deposits, lending, bank profit, and how savings accounts support your goals. 8 min beginner Interactive Not started 0% Know where your money goes when you deposit it. Start lesson →" [ref=e157] [cursor=pointer]:
          - /url: /learn/how-banks-work
          - generic [ref=e160]:
            - generic [ref=e161]:
              - generic [ref=e162]: Banking
              - img [ref=e163]
            - heading "How Banks Work and What Happens to Your Money" [level=3] [ref=e166]
            - paragraph [ref=e167]: Understand deposits, lending, bank profit, and how savings accounts support your goals.
            - generic [ref=e168]:
              - generic [ref=e169]:
                - img [ref=e170]
                - text: 8 min
              - generic [ref=e173]: beginner
              - generic [ref=e174]:
                - img [ref=e175]
                - text: Interactive
            - generic [ref=e178]:
              - generic [ref=e179]:
                - generic [ref=e180]: Not started
                - generic [ref=e181]: 0%
              - generic [ref=e183]:
                - img [ref=e184]
                - generic [ref=e186]: Know where your money goes when you deposit it.
            - paragraph [ref=e187]: Start lesson →
        - link "Banking Digital Banking and Fintech Learn how neobanks and digital wallets work and what security basics matter. 8 min beginner Interactive Not started 0% Know where your money goes when you deposit it. Start lesson →" [ref=e189] [cursor=pointer]:
          - /url: /learn/digital-banking-and-fintech
          - generic [ref=e192]:
            - generic [ref=e193]:
              - generic [ref=e194]: Banking
              - img [ref=e195]
            - heading "Digital Banking and Fintech" [level=3] [ref=e198]
            - paragraph [ref=e199]: Learn how neobanks and digital wallets work and what security basics matter.
            - generic [ref=e200]:
              - generic [ref=e201]:
                - img [ref=e202]
                - text: 8 min
              - generic [ref=e205]: beginner
              - generic [ref=e206]:
                - img [ref=e207]
                - text: Interactive
            - generic [ref=e210]:
              - generic [ref=e211]:
                - generic [ref=e212]: Not started
                - generic [ref=e213]: 0%
              - generic [ref=e215]:
                - img [ref=e216]
                - generic [ref=e218]: Know where your money goes when you deposit it.
            - paragraph [ref=e219]: Start lesson →
        - link "Budgeting The 50/30/20 Rule Learn how to split income between needs, wants, and future goals. 8 min beginner Interactive Not started 0% Plan where money goes before it disappears. Start lesson →" [ref=e221] [cursor=pointer]:
          - /url: /learn/the-50-30-20-rule
          - generic [ref=e224]:
            - generic [ref=e225]:
              - generic [ref=e226]: Budgeting
              - img [ref=e227]
            - heading "The 50/30/20 Rule" [level=3] [ref=e230]
            - paragraph [ref=e231]: Learn how to split income between needs, wants, and future goals.
            - generic [ref=e232]:
              - generic [ref=e233]:
                - img [ref=e234]
                - text: 8 min
              - generic [ref=e237]: beginner
              - generic [ref=e238]:
                - img [ref=e239]
                - text: Interactive
            - generic [ref=e242]:
              - generic [ref=e243]:
                - generic [ref=e244]: Not started
                - generic [ref=e245]: 0%
              - generic [ref=e247]:
                - img [ref=e248]
                - generic [ref=e250]: Plan where money goes before it disappears.
            - paragraph [ref=e251]: Start lesson →
        - link "Budgeting Tracking Your Money Learn how tracking spending changes behaviour and improves decisions. 8 min beginner Interactive Not started 0% Plan where money goes before it disappears. Start lesson →" [ref=e253] [cursor=pointer]:
          - /url: /learn/tracking-your-money
          - generic [ref=e256]:
            - generic [ref=e257]:
              - generic [ref=e258]: Budgeting
              - img [ref=e259]
            - heading "Tracking Your Money" [level=3] [ref=e262]
            - paragraph [ref=e263]: Learn how tracking spending changes behaviour and improves decisions.
            - generic [ref=e264]:
              - generic [ref=e265]:
                - img [ref=e266]
                - text: 8 min
              - generic [ref=e269]: beginner
              - generic [ref=e270]:
                - img [ref=e271]
                - text: Interactive
            - generic [ref=e274]:
              - generic [ref=e275]:
                - generic [ref=e276]: Not started
                - generic [ref=e277]: 0%
              - generic [ref=e279]:
                - img [ref=e280]
                - generic [ref=e282]: Plan where money goes before it disappears.
            - paragraph [ref=e283]: Start lesson →
        - link "Budgeting Irregular Income Learn how to budget when your income changes from month to month. 8 min beginner Interactive Not started 0% Plan where money goes before it disappears. Start lesson →" [ref=e285] [cursor=pointer]:
          - /url: /learn/irregular-income
          - generic [ref=e288]:
            - generic [ref=e289]:
              - generic [ref=e290]: Budgeting
              - img [ref=e291]
            - heading "Irregular Income" [level=3] [ref=e294]
            - paragraph [ref=e295]: Learn how to budget when your income changes from month to month.
            - generic [ref=e296]:
              - generic [ref=e297]:
                - img [ref=e298]
                - text: 8 min
              - generic [ref=e301]: beginner
              - generic [ref=e302]:
                - img [ref=e303]
                - text: Interactive
            - generic [ref=e306]:
              - generic [ref=e307]:
                - generic [ref=e308]: Not started
                - generic [ref=e309]: 0%
              - generic [ref=e311]:
                - img [ref=e312]
                - generic [ref=e314]: Plan where money goes before it disappears.
            - paragraph [ref=e315]: Start lesson →
        - link "Budgeting Your First Paycheck Learn how to read a payslip and understand why take-home pay is lower than expected. 8 min beginner Interactive Not started 0% Plan where money goes before it disappears. Start lesson →" [ref=e317] [cursor=pointer]:
          - /url: /learn/your-first-paycheck
          - generic [ref=e320]:
            - generic [ref=e321]:
              - generic [ref=e322]: Budgeting
              - img [ref=e323]
            - heading "Your First Paycheck" [level=3] [ref=e326]
            - paragraph [ref=e327]: Learn how to read a payslip and understand why take-home pay is lower than expected.
            - generic [ref=e328]:
              - generic [ref=e329]:
                - img [ref=e330]
                - text: 8 min
              - generic [ref=e333]: beginner
              - generic [ref=e334]:
                - img [ref=e335]
                - text: Interactive
            - generic [ref=e338]:
              - generic [ref=e339]:
                - generic [ref=e340]: Not started
                - generic [ref=e341]: 0%
              - generic [ref=e343]:
                - img [ref=e344]
                - generic [ref=e346]: Plan where money goes before it disappears.
            - paragraph [ref=e347]: Start lesson →
        - link "Budgeting Budgeting for a Goal Learn how to work backward from a goal and build a budget that gets you there. 8 min beginner Interactive Not started 0% Plan where money goes before it disappears. Start lesson →" [ref=e349] [cursor=pointer]:
          - /url: /learn/budgeting-for-a-goal
          - generic [ref=e352]:
            - generic [ref=e353]:
              - generic [ref=e354]: Budgeting
              - img [ref=e355]
            - heading "Budgeting for a Goal" [level=3] [ref=e358]
            - paragraph [ref=e359]: Learn how to work backward from a goal and build a budget that gets you there.
            - generic [ref=e360]:
              - generic [ref=e361]:
                - img [ref=e362]
                - text: 8 min
              - generic [ref=e365]: beginner
              - generic [ref=e366]:
                - img [ref=e367]
                - text: Interactive
            - generic [ref=e370]:
              - generic [ref=e371]:
                - generic [ref=e372]: Not started
                - generic [ref=e373]: 0%
              - generic [ref=e375]:
                - img [ref=e376]
                - generic [ref=e378]: Plan where money goes before it disappears.
            - paragraph [ref=e379]: Start lesson →
        - link "Debt What Is Debt? Learn what borrowing means, when debt can help, and when it creates problems. 8 min beginner Interactive Not started 0% Understand borrowing before it controls your choices. Start lesson →" [ref=e381] [cursor=pointer]:
          - /url: /learn/what-is-debt
          - generic [ref=e384]:
            - generic [ref=e385]:
              - generic [ref=e386]: Debt
              - img [ref=e387]
            - heading "What Is Debt?" [level=3] [ref=e390]
            - paragraph [ref=e391]: Learn what borrowing means, when debt can help, and when it creates problems.
            - generic [ref=e392]:
              - generic [ref=e393]:
                - img [ref=e394]
                - text: 8 min
              - generic [ref=e397]: beginner
              - generic [ref=e398]:
                - img [ref=e399]
                - text: Interactive
            - generic [ref=e402]:
              - generic [ref=e403]:
                - generic [ref=e404]: Not started
                - generic [ref=e405]: 0%
              - generic [ref=e407]:
                - img [ref=e408]
                - generic [ref=e410]: Understand borrowing before it controls your choices.
            - paragraph [ref=e411]: Start lesson →
        - link "Debt Credit Scores Explained Learn what a credit score measures and why it changes real-world options. 8 min beginner Interactive Not started 0% Understand borrowing before it controls your choices. Start lesson →" [ref=e413] [cursor=pointer]:
          - /url: /learn/credit-scores-explained
          - generic [ref=e416]:
            - generic [ref=e417]:
              - generic [ref=e418]: Debt
              - img [ref=e419]
            - heading "Credit Scores Explained" [level=3] [ref=e422]
            - paragraph [ref=e423]: Learn what a credit score measures and why it changes real-world options.
            - generic [ref=e424]:
              - generic [ref=e425]:
                - img [ref=e426]
                - text: 8 min
              - generic [ref=e429]: beginner
              - generic [ref=e430]:
                - img [ref=e431]
                - text: Interactive
            - generic [ref=e434]:
              - generic [ref=e435]:
                - generic [ref=e436]: Not started
                - generic [ref=e437]: 0%
              - generic [ref=e439]:
                - img [ref=e440]
                - generic [ref=e442]: Understand borrowing before it controls your choices.
            - paragraph [ref=e443]: Start lesson →
        - 'link "Debt Credit Cards: How They Work Learn why credit cards are loans and why minimum payments cost so much. 8 min beginner Interactive Not started 0% Understand borrowing before it controls your choices. Start lesson →" [ref=e445] [cursor=pointer]':
          - /url: /learn/credit-cards-how-they-work
          - generic [ref=e448]:
            - generic [ref=e449]:
              - generic [ref=e450]: Debt
              - img [ref=e451]
            - 'heading "Credit Cards: How They Work" [level=3] [ref=e454]'
            - paragraph [ref=e455]: Learn why credit cards are loans and why minimum payments cost so much.
            - generic [ref=e456]:
              - generic [ref=e457]:
                - img [ref=e458]
                - text: 8 min
              - generic [ref=e461]: beginner
              - generic [ref=e462]:
                - img [ref=e463]
                - text: Interactive
            - generic [ref=e466]:
              - generic [ref=e467]:
                - generic [ref=e468]: Not started
                - generic [ref=e469]: 0%
              - generic [ref=e471]:
                - img [ref=e472]
                - generic [ref=e474]: Understand borrowing before it controls your choices.
            - paragraph [ref=e475]: Start lesson →
        - link "Debt Student Loans and Education Debt Learn how student loans work and how to think about education as an investment. 8 min intermediate Interactive Not started 0% Understand borrowing before it controls your choices. Start lesson →" [ref=e477] [cursor=pointer]:
          - /url: /learn/student-loans-and-education-debt
          - generic [ref=e480]:
            - generic [ref=e481]:
              - generic [ref=e482]: Debt
              - img [ref=e483]
            - heading "Student Loans and Education Debt" [level=3] [ref=e486]
            - paragraph [ref=e487]: Learn how student loans work and how to think about education as an investment.
            - generic [ref=e488]:
              - generic [ref=e489]:
                - img [ref=e490]
                - text: 8 min
              - generic [ref=e493]: intermediate
              - generic [ref=e494]:
                - img [ref=e495]
                - text: Interactive
            - generic [ref=e498]:
              - generic [ref=e499]:
                - generic [ref=e500]: Not started
                - generic [ref=e501]: 0%
              - generic [ref=e503]:
                - img [ref=e504]
                - generic [ref=e506]: Understand borrowing before it controls your choices.
            - paragraph [ref=e507]: Start lesson →
        - link "Debt Getting Out of Debt Learn practical payoff strategies and why extra payments change the math. 8 min beginner Interactive Not started 0% Understand borrowing before it controls your choices. Start lesson →" [ref=e509] [cursor=pointer]:
          - /url: /learn/getting-out-of-debt
          - generic [ref=e512]:
            - generic [ref=e513]:
              - generic [ref=e514]: Debt
              - img [ref=e515]
            - heading "Getting Out of Debt" [level=3] [ref=e518]
            - paragraph [ref=e519]: Learn practical payoff strategies and why extra payments change the math.
            - generic [ref=e520]:
              - generic [ref=e521]:
                - img [ref=e522]
                - text: 8 min
              - generic [ref=e525]: beginner
              - generic [ref=e526]:
                - img [ref=e527]
                - text: Interactive
            - generic [ref=e530]:
              - generic [ref=e531]:
                - generic [ref=e532]: Not started
                - generic [ref=e533]: 0%
              - generic [ref=e535]:
                - img [ref=e536]
                - generic [ref=e538]: Understand borrowing before it controls your choices.
            - paragraph [ref=e539]: Start lesson →
        - link "Investing What Is Investing? Learn how investing differs from saving and why inflation matters. 8 min beginner Interactive Not started 0% Learn growth, risk, and long-term thinking. Start lesson →" [ref=e541] [cursor=pointer]:
          - /url: /learn/what-is-investing
          - generic [ref=e544]:
            - generic [ref=e545]:
              - generic [ref=e546]: Investing
              - img [ref=e547]
            - heading "What Is Investing?" [level=3] [ref=e550]
            - paragraph [ref=e551]: Learn how investing differs from saving and why inflation matters.
            - generic [ref=e552]:
              - generic [ref=e553]:
                - img [ref=e554]
                - text: 8 min
              - generic [ref=e557]: beginner
              - generic [ref=e558]:
                - img [ref=e559]
                - text: Interactive
            - generic [ref=e562]:
              - generic [ref=e563]:
                - generic [ref=e564]: Not started
                - generic [ref=e565]: 0%
              - generic [ref=e567]:
                - img [ref=e568]
                - generic [ref=e570]: Learn growth, risk, and long-term thinking.
            - paragraph [ref=e571]: Start lesson →
        - link "Investing Stocks, Bonds, and Funds Learn the basics of ownership, lending, and diversified funds. 8 min beginner Interactive Not started 0% Learn growth, risk, and long-term thinking. Start lesson →" [ref=e573] [cursor=pointer]:
          - /url: /learn/stocks-bonds-and-funds
          - generic [ref=e576]:
            - generic [ref=e577]:
              - generic [ref=e578]: Investing
              - img [ref=e579]
            - heading "Stocks, Bonds, and Funds" [level=3] [ref=e582]
            - paragraph [ref=e583]: Learn the basics of ownership, lending, and diversified funds.
            - generic [ref=e584]:
              - generic [ref=e585]:
                - img [ref=e586]
                - text: 8 min
              - generic [ref=e589]: beginner
              - generic [ref=e590]:
                - img [ref=e591]
                - text: Interactive
            - generic [ref=e594]:
              - generic [ref=e595]:
                - generic [ref=e596]: Not started
                - generic [ref=e597]: 0%
              - generic [ref=e599]:
                - img [ref=e600]
                - generic [ref=e602]: Learn growth, risk, and long-term thinking.
            - paragraph [ref=e603]: Start lesson →
        - link "Investing Risk and Return Learn why higher return usually means higher uncertainty and why diversification helps. 8 min intermediate Interactive Not started 0% Learn growth, risk, and long-term thinking. Start lesson →" [ref=e605] [cursor=pointer]:
          - /url: /learn/risk-and-return
          - generic [ref=e608]:
            - generic [ref=e609]:
              - generic [ref=e610]: Investing
              - img [ref=e611]
            - heading "Risk and Return" [level=3] [ref=e614]
            - paragraph [ref=e615]: Learn why higher return usually means higher uncertainty and why diversification helps.
            - generic [ref=e616]:
              - generic [ref=e617]:
                - img [ref=e618]
                - text: 8 min
              - generic [ref=e621]: intermediate
              - generic [ref=e622]:
                - img [ref=e623]
                - text: Interactive
            - generic [ref=e626]:
              - generic [ref=e627]:
                - generic [ref=e628]: Not started
                - generic [ref=e629]: 0%
              - generic [ref=e631]:
                - img [ref=e632]
                - generic [ref=e634]: Learn growth, risk, and long-term thinking.
            - paragraph [ref=e635]: Start lesson →
        - link "Investing Starting to Invest as a Teen Learn what investing options teens can use and why early starts are powerful. 8 min beginner Interactive Not started 0% Learn growth, risk, and long-term thinking. Start lesson →" [ref=e637] [cursor=pointer]:
          - /url: /learn/starting-to-invest-as-a-teen
          - generic [ref=e640]:
            - generic [ref=e641]:
              - generic [ref=e642]: Investing
              - img [ref=e643]
            - heading "Starting to Invest as a Teen" [level=3] [ref=e646]
            - paragraph [ref=e647]: Learn what investing options teens can use and why early starts are powerful.
            - generic [ref=e648]:
              - generic [ref=e649]:
                - img [ref=e650]
                - text: 8 min
              - generic [ref=e653]: beginner
              - generic [ref=e654]:
                - img [ref=e655]
                - text: Interactive
            - generic [ref=e658]:
              - generic [ref=e659]:
                - generic [ref=e660]: Not started
                - generic [ref=e661]: 0%
              - generic [ref=e663]:
                - img [ref=e664]
                - generic [ref=e666]: Learn growth, risk, and long-term thinking.
            - paragraph [ref=e667]: Start lesson →
        - link "Saving Emergency Funds Learn why emergencies need cash savings and how to build a buffer on a small income. 8 min beginner Interactive Not started 0% Turn small habits into future freedom. Start lesson →" [ref=e669] [cursor=pointer]:
          - /url: /learn/emergency-funds
          - generic [ref=e672]:
            - generic [ref=e673]:
              - generic [ref=e674]: Saving
              - img [ref=e675]
            - heading "Emergency Funds" [level=3] [ref=e678]
            - paragraph [ref=e679]: Learn why emergencies need cash savings and how to build a buffer on a small income.
            - generic [ref=e680]:
              - generic [ref=e681]:
                - img [ref=e682]
                - text: 8 min
              - generic [ref=e685]: beginner
              - generic [ref=e686]:
                - img [ref=e687]
                - text: Interactive
            - generic [ref=e690]:
              - generic [ref=e691]:
                - generic [ref=e692]: Not started
                - generic [ref=e693]: 0%
              - generic [ref=e695]:
                - img [ref=e696]
                - generic [ref=e698]: Turn small habits into future freedom.
            - paragraph [ref=e699]: Start lesson →
        - link "Saving Short vs Long-Term Goals Learn how time horizon changes the way you save and spend. 8 min beginner Interactive Not started 0% Turn small habits into future freedom. Start lesson →" [ref=e701] [cursor=pointer]:
          - /url: /learn/short-vs-long-term-goals
          - generic [ref=e704]:
            - generic [ref=e705]:
              - generic [ref=e706]: Saving
              - img [ref=e707]
            - heading "Short vs Long-Term Goals" [level=3] [ref=e710]
            - paragraph [ref=e711]: Learn how time horizon changes the way you save and spend.
            - generic [ref=e712]:
              - generic [ref=e713]:
                - img [ref=e714]
                - text: 8 min
              - generic [ref=e717]: beginner
              - generic [ref=e718]:
                - img [ref=e719]
                - text: Interactive
            - generic [ref=e722]:
              - generic [ref=e723]:
                - generic [ref=e724]: Not started
                - generic [ref=e725]: 0%
              - generic [ref=e727]:
                - img [ref=e728]
                - generic [ref=e730]: Turn small habits into future freedom.
            - paragraph [ref=e731]: Start lesson →
        - link "Saving Compound Interest Learn how compound growth works and why starting early matters so much. 8 min intermediate Interactive Not started 0% Turn small habits into future freedom. Start lesson →" [ref=e733] [cursor=pointer]:
          - /url: /learn/compound-interest
          - generic [ref=e736]:
            - generic [ref=e737]:
              - generic [ref=e738]: Saving
              - img [ref=e739]
            - heading "Compound Interest" [level=3] [ref=e742]
            - paragraph [ref=e743]: Learn how compound growth works and why starting early matters so much.
            - generic [ref=e744]:
              - generic [ref=e745]:
                - img [ref=e746]
                - text: 8 min
              - generic [ref=e749]: intermediate
              - generic [ref=e750]:
                - img [ref=e751]
                - text: Interactive
            - generic [ref=e754]:
              - generic [ref=e755]:
                - generic [ref=e756]: Not started
                - generic [ref=e757]: 0%
              - generic [ref=e759]:
                - img [ref=e760]
                - generic [ref=e762]: Turn small habits into future freedom.
            - paragraph [ref=e763]: Start lesson →
        - link "Saving Savings Accounts and Interest Learn how APY works, how to compare accounts, and why inflation matters. 8 min beginner Interactive Not started 0% Turn small habits into future freedom. Start lesson →" [ref=e765] [cursor=pointer]:
          - /url: /learn/savings-accounts-and-interest
          - generic [ref=e768]:
            - generic [ref=e769]:
              - generic [ref=e770]: Saving
              - img [ref=e771]
            - heading "Savings Accounts and Interest" [level=3] [ref=e774]
            - paragraph [ref=e775]: Learn how APY works, how to compare accounts, and why inflation matters.
            - generic [ref=e776]:
              - generic [ref=e777]:
                - img [ref=e778]
                - text: 8 min
              - generic [ref=e781]: beginner
              - generic [ref=e782]:
                - img [ref=e783]
                - text: Interactive
            - generic [ref=e786]:
              - generic [ref=e787]:
                - generic [ref=e788]: Not started
                - generic [ref=e789]: 0%
              - generic [ref=e791]:
                - img [ref=e792]
                - generic [ref=e794]: Turn small habits into future freedom.
            - paragraph [ref=e795]: Start lesson →
        - link "Saving The Pay Yourself First Method Learn why automatic saving beats relying on willpower every month. 8 min beginner Interactive Not started 0% Turn small habits into future freedom. Start lesson →" [ref=e797] [cursor=pointer]:
          - /url: /learn/the-pay-yourself-first-method
          - generic [ref=e800]:
            - generic [ref=e801]:
              - generic [ref=e802]: Saving
              - img [ref=e803]
            - heading "The Pay Yourself First Method" [level=3] [ref=e806]
            - paragraph [ref=e807]: Learn why automatic saving beats relying on willpower every month.
            - generic [ref=e808]:
              - generic [ref=e809]:
                - img [ref=e810]
                - text: 8 min
              - generic [ref=e813]: beginner
              - generic [ref=e814]:
                - img [ref=e815]
                - text: Interactive
            - generic [ref=e818]:
              - generic [ref=e819]:
                - generic [ref=e820]: Not started
                - generic [ref=e821]: 0%
              - generic [ref=e823]:
                - img [ref=e824]
                - generic [ref=e826]: Turn small habits into future freedom.
            - paragraph [ref=e827]: Start lesson →
        - link "Tax Understanding Your Income Learn the main ways people earn money and how to compare earning options. 8 min beginner Interactive Not started 0% Understand deductions, payslips, and public services. Start lesson →" [ref=e829] [cursor=pointer]:
          - /url: /learn/understanding-your-income
          - generic [ref=e832]:
            - generic [ref=e833]:
              - generic [ref=e834]: Tax
              - img [ref=e835]
            - heading "Understanding Your Income" [level=3] [ref=e838]
            - paragraph [ref=e839]: Learn the main ways people earn money and how to compare earning options.
            - generic [ref=e840]:
              - generic [ref=e841]:
                - img [ref=e842]
                - text: 8 min
              - generic [ref=e845]: beginner
              - generic [ref=e846]:
                - img [ref=e847]
                - text: Interactive
            - generic [ref=e850]:
              - generic [ref=e851]:
                - generic [ref=e852]: Not started
                - generic [ref=e853]: 0%
              - generic [ref=e855]:
                - img [ref=e856]
                - generic [ref=e858]: Understand deductions, payslips, and public services.
            - paragraph [ref=e859]: Start lesson →
        - link "Tax Taxes and Why They Exist Learn what taxes pay for and how income tax works at a basic level. 8 min beginner Interactive Not started 0% Understand deductions, payslips, and public services. Start lesson →" [ref=e861] [cursor=pointer]:
          - /url: /learn/taxes-and-why-they-exist
          - generic [ref=e864]:
            - generic [ref=e865]:
              - generic [ref=e866]: Tax
              - img [ref=e867]
            - heading "Taxes and Why They Exist" [level=3] [ref=e870]
            - paragraph [ref=e871]: Learn what taxes pay for and how income tax works at a basic level.
            - generic [ref=e872]:
              - generic [ref=e873]:
                - img [ref=e874]
                - text: 8 min
              - generic [ref=e877]: beginner
              - generic [ref=e878]:
                - img [ref=e879]
                - text: Interactive
            - generic [ref=e882]:
              - generic [ref=e883]:
                - generic [ref=e884]: Not started
                - generic [ref=e885]: 0%
              - generic [ref=e887]:
                - img [ref=e888]
                - generic [ref=e890]: Understand deductions, payslips, and public services.
            - paragraph [ref=e891]: Start lesson →
  - contentinfo [ref=e892]:
    - generic [ref=e893]:
      - generic [ref=e894]:
        - img "Finly" [ref=e895]:
          - generic [ref=e899]: fin
          - generic [ref=e900]: ly
        - paragraph [ref=e901]: Financial education for the next generation.
      - navigation [ref=e902]:
        - link "Learn" [ref=e903] [cursor=pointer]:
          - /url: /learn
        - link "Curriculum" [ref=e904] [cursor=pointer]:
          - /url: /curriculum
        - link "About" [ref=e905] [cursor=pointer]:
          - /url: /about
        - link "Privacy" [ref=e906] [cursor=pointer]:
          - /url: /privacy
      - paragraph [ref=e907]: 100% free, always
  - button "Open Next.js Dev Tools" [ref=e913] [cursor=pointer]:
    - img [ref=e914]
  - alert [ref=e917]
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
> 41  |       expect(href).toMatch(/\/learn\//);
      |                    ^ Error: expect(received).toMatch(expected)
  42  |     }
  43  |   });
  44  | });
  45  | 
  46  | test.describe("Lesson completion API", () => {
  47  |   let userId: string;
  48  |   let email: string;
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
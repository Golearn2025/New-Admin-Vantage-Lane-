# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e3]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img "Vantage Lane" [ref=e7]
        - generic [ref=e8]: VantageLane
        - paragraph [ref=e9]: Admin Access
        - heading "Sign In" [level=2] [ref=e10]
      - generic [ref=e11]:
        - group [ref=e13]:
          - generic [ref=e14]:
            - generic [ref=e15]: Email address*
            - textbox "Email addressrequired" [active] [ref=e18]:
              - /placeholder: admin@test.com
          - generic [ref=e20]:
            - generic [ref=e21]: Password*
            - generic [ref=e23]:
              - textbox "Passwordrequired" [ref=e24]:
                - /placeholder: ••••••••
              - button [ref=e26] [cursor=pointer]:
                - img [ref=e27]
          - generic [ref=e32]:
            - checkbox "Remember me" [ref=e33] [cursor=pointer]
            - generic [ref=e34] [cursor=pointer]: Remember me
          - button "Sign in" [disabled] [ref=e35]:
            - generic [ref=e36]: Sign in
          - link "Forgot password?" [ref=e38] [cursor=pointer]:
            - /url: /forgot-password
        - generic [ref=e39]: © 2025 Vantage Lane
  - alert [ref=e40]
```
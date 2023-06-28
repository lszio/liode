import { useState, useEffect } from "react"

export default function SubmissionCheck() {
  const [promot, setPromot] = useState(localStorage.getItem("submission-check-promot") || "")
  const [users, setUsers] = useState([])

  useEffect(() => {
    setUsers(promot.split(/[.,;\n]/).filter(n => n))
  }, [promot])

  const [submission, setSubmission] = useState<Record<string, boolean>>(users.reduce((o, c) => {
    o[c] = false
    return o
  }, {}))
  return <>
    <div>Promot</div>
    <textarea value={promot} onChange={(e) => {
      setPromot(e.target.value),
        localStorage.setItem("submission-check-promot", e.target.value);
    }} />
    <div>Users</div>
    <form>
      {users.map((k, i) => {
        return <div key={k}>
          <input name={k}
            id={i.toString()}
            onChange={() => {
              setSubmission({ ...submission, [k]: !submission[k] })
            }}
            checked={submission[k]} type="checkbox" value={k} />
          <label htmlFor={i.toString()}>{k}</label>
        </div>
      })}
    </form>
    <div>unsubmitted</div>
    <ul>
      {users.map((k) => {
        if (submission[k]) return undefined
        else return <li>{k}</li>
      })}
    </ul>
  </>
}

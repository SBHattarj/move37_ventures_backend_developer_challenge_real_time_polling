import test from "node:test"
import io from "socket.io-client"
import {serverListen} from "./index.js"
import assert from "assert"
import { PublishStatus } from "./src/generated/prisma/client/index.js"
import { VoteAction } from "./src/server.js"

const baseURL = `http://localhost:${process.env.PORT || 3000}`

test("server", async (t) => {
    await t.test("user", async (t) => {
        await t.test("create user fail on no data", async (t) => {
            const res = await fetch(`${baseURL}/api/user/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            })
            
            assert.strictEqual(res.status, 400)
            const {error} = await res.json()
            assert.strictEqual(error, "missing name at .")
        })
        await t.test("create user fail on no name", async (t) => {
            const res = await fetch(`${baseURL}/api/user/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email: "test", password: "test"})
            })
            
            assert.strictEqual(res.status, 400)
            const {error} = await res.json()
            assert.strictEqual(error, "missing name at .")
        })
        await t.test("create user fail on no email", async (t) => {
            const res = await fetch(`${baseURL}/api/user/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name: "test", password: "test"})
            })
            
            assert.strictEqual(res.status, 400)
            const {error} = await res.json()
            assert.strictEqual(error, "missing email at .")
        })
        await t.test("create user fail on no password", async (t) => {
            const res = await fetch(`${baseURL}/api/user/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name: "test", email: "test"})
            })
            
            assert.strictEqual(res.status, 400)
            const {error} = await res.json()
            assert.strictEqual(error, "missing password at .")
        })
        await t.test("signup user fail on no data", async (t) => {
            const res = await fetch(`${baseURL}/api/user/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            })
            
            assert.strictEqual(res.status, 400)
            const {error} = await res.json()
            assert.strictEqual(error, "missing name at .")
        })
        await t.test("signup user fail on no name", async (t) => {
            const res = await fetch(`${baseURL}/api/user/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email: "test", password: "test"})
            })
            
            assert.strictEqual(res.status, 400)
            const {error} = await res.json()
            assert.strictEqual(error, "missing name at .")
        })
        await t.test("signup user fail on no email", async (t) => {
            const res = await fetch(`${baseURL}/api/user/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name: "test", password: "test"})
            })
            
            assert.strictEqual(res.status, 400)
            const {error} = await res.json()
            assert.strictEqual(error, "missing email at .")
        })
        await t.test("signup user fail on no password", async (t) => {
            const res = await fetch(`${baseURL}/api/user/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name: "test", email: "test"})
            })
            
            assert.strictEqual(res.status, 400)
            const {error} = await res.json()
            assert.strictEqual(error, "missing password at .")
        })
        await t.test("create user", async (t) => {
            const res = await fetch(`${baseURL}/api/user/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name: "test", email: "test@test", password: "test"})
            })
            assert.strictEqual(res.status, 200)
            const user = await res.json()
            assert.strictEqual(user.name, "test")
            assert.strictEqual(user.email, "test@test")
        })
        await t.test("signin user fail no data", async (t) => {
            const res = await fetch(`${baseURL}/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            })
            assert.strictEqual(res.status, 400)
            const {error} = await res.json()
            assert.strictEqual(error, "missing email at .")
        })
        await t.test("signin user fail no email", async (t) => {
            const res = await fetch(`${baseURL}/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({password: "test"})
            })
            assert.strictEqual(res.status, 400)
            const {error} = await res.json()
            assert.strictEqual(error, "missing email at .")
        })
        await t.test("signin user fail no password", async (t) => {
            const res = await fetch(`${baseURL}/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email: "test@test"})
            })
            assert.strictEqual(res.status, 400)
            const {error} = await res.json()
            assert.strictEqual(error, "missing password at .")
        })
        let tokenLast = ""
        await t.test("sigin user", async (t) => {
            const res = await fetch(`${baseURL}/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email: "test@test", password: "test"})
            })
            assert.strictEqual(res.status, 200)
            const {token, user} = await res.json()
            assert.strictEqual(user.name, "test")
            assert.strictEqual(user.email, "test@test")
            tokenLast = token
        })
        await t.test("delete unauthorised", async (t) => {
            const res = await fetch(`${baseURL}/api/user/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            assert.strictEqual(res.status, 401)
            const {error} = await res.json()
            assert.strictEqual(error, "Unauthorized")
        })
        await t.test("delete user", async (t) => {
            const res = await fetch(`${baseURL}/api/user/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'cookie': `token=${tokenLast}`
                },
            })
            assert.strictEqual(res.status, 200)
            const user = await res.json()
            assert.strictEqual(user.name, "test")
            assert.strictEqual(user.email, "test@test")
        })
        let userLast
        await t.test("signup user", async (t) => {
            const res = await fetch(`${baseURL}/api/user/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name: "test", email: "test@test", password: "test"})
            })
            assert.strictEqual(res.status, 200)
            const {token, user} = await res.json()
            assert.strictEqual(user.name, "test")
            assert.strictEqual(user.email, "test@test")
            tokenLast = token
            userLast = user
        })
        await t.test("logout unauthorised", async (t) => {
            const res = await fetch(`${baseURL}/api/user/logout`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            assert.strictEqual(res.status, 401)
            const {error} = await res.json()
            assert.strictEqual(error, "Unauthorized")
        })
        await t.test("logout user", async (t) => {
            const res = await fetch(`${baseURL}/api/user/logout`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'cookie': `token=${tokenLast}`
                },
            })
            assert.strictEqual(res.status, 200)
            const message = await res.text()
            assert.strictEqual(message, "session deleted")
            const resSignin = await fetch(`${baseURL}/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email: "test@test", password: "test"})
            })
            const {token, user} = await resSignin.json()
            tokenLast = token
            userLast = user

        })
        await t.test("get users", async (t) => {
            const res = await fetch(`${baseURL}/api/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            assert.strictEqual(res.status, 200)
            const {users} = await res.json()
            assert.strictEqual(users.length, 1)
            assert.strictEqual(users[0].name, "test")
            assert.strictEqual(users[0].email, "test@test")
        })
        await t.test("get user start", async (t) => {
            const res = await fetch(`${baseURL}/api/user?start=1`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            assert.strictEqual(res.status, 200)
            const {users} = await res.json()
            assert.strictEqual(users.length, 0)
        })
        await t.test("get user limit", async (t) => {
            const res = await fetch(`${baseURL}/api/user?limit=0`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            assert.strictEqual(res.status, 200)
            const {users} = await res.json()
            assert.strictEqual(users.length, 0)
        })
        await t.test("get user by id", async (t) => {
            const res = await fetch(`${baseURL}/api/user/${userLast.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            assert.strictEqual(res.status, 200)
            const {user} = await res.json()
            assert.strictEqual(user.name, "test")
            assert.strictEqual(user.email, "test@test")
        })
        await t.test("get current user", async (t) => {
            const res = await fetch(`${baseURL}/api/user/self`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'cookie': `token=${tokenLast}`
                },
            })
            assert.strictEqual(res.status, 200)
            const {user} = await res.json()
            assert.strictEqual(user.name, "test")
            assert.strictEqual(user.email, "test@test")
        })
        await t.test("update user unauthorised", async (t) => {
            const res = await fetch(`${baseURL}/api/user/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: "test 1"})
            })
            assert.strictEqual(res.status, 401)
            const {error} = await res.json()
            assert.strictEqual(error, "Unauthorized")
        })
        await t.test("update user", async (t) => {
            const res = await fetch(`${baseURL}/api/user/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'cookie': `token=${tokenLast}`
                },
                body: JSON.stringify({name: "test 1"})
            })
            assert.strictEqual(res.status, 200)
            const user = await res.json()
            assert.strictEqual(user.name, "test 1")
            assert.strictEqual(user.email, "test@test")
        })
        await fetch(`${baseURL}/api/user/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'cookie': `token=${tokenLast}`
            },
        })
    })
    await t.test("polls", async (t) => {
        const resUser = await fetch(`${baseURL}/api/user/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: "test", email: "test@test", password: "test"})
        })
        const {token, user} = await resUser.json()
        t.test("create poll unauthorised", async (t) => {
            const res = await fetch(`${baseURL}/api/poll/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            assert.strictEqual(res.status, 401)
            const {error} = await res.json()
            assert.strictEqual(error, "Unauthorized")
        })
        await t.test("create poll no data", async (t) => {
            const res = await fetch(`${baseURL}/api/poll/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'cookie': `token=${token}`
                },
            })
            assert.strictEqual(res.status, 400)
            const {error} = await res.json()
            assert.strictEqual(error, "missing question at .")
        })
        await t.test("create poll no question", async (t) => {
            const res = await fetch(`${baseURL}/api/poll/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'cookie': `token=${token}`
                },
                body: JSON.stringify({isPublished: PublishStatus.UNPUBLISHED})
            })
        })
        await t.test("create poll no isPublished", async (t) => {
            const res = await fetch(`${baseURL}/api/poll/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'cookie': `token=${token}`
                },
                body: JSON.stringify({question: "test"})
            })
            assert.strictEqual(res.status, 400)
            const {error} = await res.json()
            assert.strictEqual(error, "missing isPublished at .")
        })
        let pollLast
        await t.test("create poll", async (t) => {
            const res = await fetch(`${baseURL}/api/poll/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'cookie': `token=${token}`
                },
                body: JSON.stringify({question: "test", isPublished: PublishStatus.UNPUBLISHED})
            })
            assert.strictEqual(res.status, 200)
            const poll = await res.json()
            pollLast = poll
            assert.strictEqual(poll.question, "test")
            assert.strictEqual(poll.isPublished, PublishStatus.UNPUBLISHED)
        })
        await t.test("get poll unpublished", async (t) => {
            const res = await fetch(`${baseURL}/api/poll/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            assert.strictEqual(res.status, 200)
            const {polls} = await res.json()
            assert.strictEqual(polls.length, 0)
        })
        await t.test("get poll self unauthorised", async (t) => {
            const res = await fetch(`${baseURL}/api/poll/self`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            assert.strictEqual(res.status, 401)
            const {error} = await res.json()
            assert.strictEqual(error, "Unauthorized")
        })
        await t.test("get poll self", async (t) => {
            const res = await fetch(`${baseURL}/api/poll/self`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'cookie': `token=${token}`
                },
            })
            assert.strictEqual(res.status, 200)
            const {polls} = await res.json()
            assert.strictEqual(polls.length, 1)
            assert.strictEqual(polls[0].question, "test")
            assert.strictEqual(polls[0].isPublished, PublishStatus.UNPUBLISHED)
        })
        await t.test("update poll unauthorised", async (t) => {
            const res = await fetch(`${baseURL}/api/poll/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({isPublished: PublishStatus.PUBLISHED, pollId: pollLast.id})
            })
            assert.strictEqual(res.status, 401)
            const {error} = await res.json()
            assert.strictEqual(error, "Unauthorized")
        })
        await t.test("update poll no id", async (t) => {
            const res = await fetch(`${baseURL}/api/poll/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'cookie': `token=${token}`
                },
                body: JSON.stringify({isPublished: PublishStatus.PUBLISHED})
            })
            assert.strictEqual(res.status, 400)
            const {error} = await res.json()
            assert.strictEqual(error, "missing pollId at .")
        })
        await t.test("update poll", async (t) => {
            const res = await fetch(`${baseURL}/api/poll/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'cookie': `token=${token}`
                },
                body: JSON.stringify({isPublished: PublishStatus.PUBLISHED, pollId: pollLast.id})
            })
            assert.strictEqual(res.status, 200)
            const poll = await res.json()
            assert.strictEqual(poll.question, "test")
            assert.strictEqual(poll.isPublished, PublishStatus.PUBLISHED)
            pollLast = poll
        })
        await t.test("get poll published", async (t) => {
            const res = await fetch(`${baseURL}/api/poll/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            assert.strictEqual(res.status, 200)
            const {polls} = await res.json()
            assert.strictEqual(polls.length, 1)
            assert.strictEqual(polls[0].question, "test")
            assert.strictEqual(polls[0].isPublished, PublishStatus.PUBLISHED)
        })
        await t.test("pollOptions", async (t) => {
            await t.test("pollOptions create unauthorised", async (t) => {
                const res = await fetch(`${baseURL}/api/poll/polloption/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({pollId: pollLast.id, text: "test"})
                })
                assert.strictEqual(res.status, 401)
                const {error} = await res.json()
                assert.strictEqual(error, "Unauthorized")
            })
            let pollOptionLast
            await t.test("pollOptions create no data", async (t) => {
                const res = await fetch(`${baseURL}/api/poll/polloption/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'cookie': `token=${token}`
                    },
                    body: JSON.stringify({})
                })
                assert.strictEqual(res.status, 400)
                const {error} = await res.json()
                assert.strictEqual(error, "missing pollId at .")
            })
            await t.test("pollOptions create no pollId", async (t) => {
                const res = await fetch(`${baseURL}/api/poll/polloption/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'cookie': `token=${token}`
                    },
                    body: JSON.stringify({text: "test"})
                })
                assert.strictEqual(res.status, 400)
                const {error} = await res.json()
                assert.strictEqual(error, "missing pollId at .")
            })
            await t.test("pollOptions create no text", async (t) => {
                const res = await fetch(`${baseURL}/api/poll/polloption/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'cookie': `token=${token}`
                    },
                    body: JSON.stringify({pollId: pollLast.id})
                })
                assert.strictEqual(res.status, 400)
                const {error} = await res.json()
                assert.strictEqual(error, "missing text at .")
            })
            await t.test("pollOptions create", async (t) => {
                const res = await fetch(`${baseURL}/api/poll/polloption/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'cookie': `token=${token}`
                    },
                    body: JSON.stringify({pollId: pollLast.id, text: "test"})
                })
                assert.strictEqual(res.status, 200)
                const pollOption = await res.json()
                assert.strictEqual(pollOption.text, "test")
                pollOptionLast = pollOption
            })
            await t.test("pollOptions update unauthorised", async (t) => {
                const res = await fetch(`${baseURL}/api/poll/polloption/update`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({pollId: pollLast.id, pollOptionId: pollOptionLast.id, text: "test"})
                })
                assert.strictEqual(res.status, 401)
                const {error} = await res.json()
                assert.strictEqual(error, "Unauthorized")
            })
            await t.test("pollOptions update no data", async (t) => {
                const res = await fetch(`${baseURL}/api/poll/polloption/update`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'cookie': `token=${token}`
                    },
                    body: JSON.stringify({})
                })
                assert.strictEqual(res.status, 400)
                const {error} = await res.json()
                assert.strictEqual(error, "missing pollId at .")
            })
            await t.test("pollOptions update no pollId", async (t) => {
                const res = await fetch(`${baseURL}/api/poll/polloption/update`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'cookie': `token=${token}`
                    },
                    body: JSON.stringify({pollOptionId: pollOptionLast.id, text: "test"})
                })
                assert.strictEqual(res.status, 400)
                const {error} = await res.json()
                assert.strictEqual(error, "missing pollId at .")
            })
            await t.test("pollOptions update no pollOptionId", async (t) => {
                const res = await fetch(`${baseURL}/api/poll/polloption/update`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'cookie': `token=${token}`
                    },
                    body: JSON.stringify({pollId: pollLast.id, text: "test"})
                })
                assert.strictEqual(res.status, 400)
                const {error} = await res.json()
                assert.strictEqual(error, "missing pollOptionId at .")
            })
            await t.test("pollOptions update", async (t) => {
                const res = await fetch(`${baseURL}/api/poll/polloption/update`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'cookie': `token=${token}`
                    },
                    body: JSON.stringify({pollId: pollLast.id, pollOptionId: pollOptionLast.id, text: "test 1"})
                })
                assert.strictEqual(res.status, 200)
                const pollOption = await res.json()
                assert.strictEqual(pollOption.text, "test 1")
                pollOptionLast = pollOption
            })
            await t.test("vote", async (t) => {
                const socket = io(`http://localhost:${process.env.PORT || 3000}`, {transports: ["websocket"], upgrade: false})
                const socketTest = new Promise((resolve, reject) => {
                    let incremented = false
                    let decremented = false
                    setTimeout(() => {
                        if(incremented && decremented) return
                        reject("timeout")
                        socket.close()
                    }, 1000)
                    socket.on(`vote:${pollLast.id}`, ({action, pollOptionId}) => {
                        if(action === VoteAction.INCREMENT && pollOptionId === pollOptionLast.id) {
                            incremented = true
                        }
                        if(action === VoteAction.DECREMENT && pollOptionId === pollOptionLast.id) {
                            decremented = true
                        }
                        if(incremented && decremented) {
                            resolve(true)
                            socket.close()
                        }
                    })
                })
                await t.test("vote create unauthorised", async (t) => {
                    const res = await fetch(`${baseURL}/api/vote/create`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({pollOptionId: pollOptionLast.id})
                    })
                    assert.strictEqual(res.status, 401)
                    const {error} = await res.json()
                    assert.strictEqual(error, "Unauthorized")
                })
                await t.test("vote create no data", async (t) => {
                    const res = await fetch(`${baseURL}/api/vote/create`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            'cookie': `token=${token}`
                        },
                        body: JSON.stringify({})
                    })
                    assert.strictEqual(res.status, 400)
                    const {error} = await res.json()
                    assert.strictEqual(error, "missing pollOptionId at .")
                })
                await t.test("vote create", async (t) => {
                    const res = await fetch(`${baseURL}/api/vote/create`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            'cookie': `token=${token}`
                        },
                        body: JSON.stringify({pollOptionId: pollOptionLast.id})
                    })
                    assert.strictEqual(res.status, 200)
                })
                await t.test("vote delete unauthorised", async (t) => {
                    const res = await fetch(`${baseURL}/api/vote/delete`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({pollOptionId: pollOptionLast.id})
                    })
                    assert.strictEqual(res.status, 401)
                    const {error} = await res.json()
                    assert.strictEqual(error, "Unauthorized")
                })
                await t.test("vote delete no data", async (t) => {
                    const res = await fetch(`${baseURL}/api/vote/delete`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            'cookie': `token=${token}`
                        },
                        body: JSON.stringify({})
                    })
                    assert.strictEqual(res.status, 400)
                    const {error} = await res.json()
                    assert.strictEqual(error, "missing pollOptionId at .")
                })
                await t.test("vote delete", async (t) => {
                    const res = await fetch(`${baseURL}/api/vote/delete`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            'cookie': `token=${token}`
                        },
                        body: JSON.stringify({pollOptionId: pollOptionLast.id})
                    })
                    assert.strictEqual(res.status, 200)
                })
                await t.test("vote socket", async (t) => {
                    const testResult = await socketTest
                    assert.strictEqual(testResult, true)
                })
            })

            await t.test("pollOptions delete unauthorised", async (t) => {
                const res = await fetch(`${baseURL}/api/poll/polloption/delete`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({pollId: pollLast.id, pollOptionId: pollOptionLast.id})
                })
                assert.strictEqual(res.status, 401)
                const {error} = await res.json()
                assert.strictEqual(error, "Unauthorized")
            })
            await t.test("pollOptions delete no data", async (t) => {
                const res = await fetch(`${baseURL}/api/poll/polloption/delete`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        'cookie': `token=${token}`
                    },
                    body: JSON.stringify({})
                })
                assert.strictEqual(res.status, 400)
                const {error} = await res.json()
                assert.strictEqual(error, "missing pollId at .")
            })
            await t.test("pollOptions delete no pollId", async (t) => {
                const res = await fetch(`${baseURL}/api/poll/polloption/delete`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        'cookie': `token=${token}`
                    },
                    body: JSON.stringify({pollOptionId: pollOptionLast.id})
                })
                assert.strictEqual(res.status, 400)
                const {error} = await res.json()
                assert.strictEqual(error, "missing pollId at .")
            })
            await t.test("pollOptions delete no pollOptionId", async (t) => {
                const res = await fetch(`${baseURL}/api/poll/polloption/delete`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        'cookie': `token=${token}`
                    },
                    body: JSON.stringify({pollId: pollLast.id})
                })
                assert.strictEqual(res.status, 400)
                const {error} = await res.json()
                assert.strictEqual(error, "missing pollOptionId at .")
            })
            await t.test("pollOptions delete", async (t) => {
                const res = await fetch(`${baseURL}/api/poll/polloption/delete`, {
                    method: "delete",
                    headers: {
                        "Content-Type": "application/json",
                        'cookie': `token=${token}`
                    },
                    body: JSON.stringify({pollId: pollLast.id, pollOptionId: pollOptionLast.id})
                })
                assert.strictEqual(res.status, 200)
                const pollOption = await res.json()
                assert.strictEqual(pollOption.text, pollOptionLast.text)
            })
        })
        await t.test("delete poll unauthorised", async (t) => {
            const res = await fetch(`${baseURL}/api/poll/${pollLast.id}/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            assert.strictEqual(res.status, 401)
            const {error} = await res.json()
            assert.strictEqual(error, "Unauthorized")
        })
        await t.test("delete poll", async (t) => {
            const res = await fetch(`${baseURL}/api/poll/${pollLast.id}/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'cookie': `token=${token}`
                },
            })
            assert.strictEqual(res.status, 200)
            const poll = await res.json()
            assert.strictEqual(poll.question, pollLast.question)
            assert.strictEqual(poll.isPublished, pollLast.isPublished)
        })
        await fetch(`${baseURL}/api/user/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'cookie': `token=${token}`
            },
        })
    })
    serverListen.close()
    console.log("test end")
})

link to tldr: https://www.tldraw.com/p/kjRgmQXsaCAiMQyBJRsjg?d=v-89.812.1252.945.3-o-SoXeuXn5lZZlz3pPW

users => name, email
courses => name, description, videos
videos => title, duration, course (relation)
video_watch_history => user, video, watch_percentage, watched_at
stars => user, video, starts, awarded_at
leader_boards => name, type, course (relation)
leader_board_scores => user, leaderboard, start_count

The entire logic should revolve only along the stars allocated

Note Implemented
It would be better if we use server sent events in background to send data
or latest updated via a webhook to ensure the UI is updated optimistically

usage of transactions

Implementing proper db level transactions can be really useful,
as a single db entry to doing the heavy lifting

api gateway choices

perfect usecase for applications of this nature is using hasura.

Just by attaching an existing db, to hasura it will auto generate all apis
that too in graphql, reducing the fetching bandwith

Hasura also ensure it has the most optimal sql queires in background

It also provides secure db admin panel, which can use used as backoffice

Hasura by default provide promptql

If not interested in integrating AI at all, chosing payloadCMS would be good

It provides us a basic abstraction on code level for creating collections, RBAC
and an admin panel

Provide something called as hooks, which are safe and based on data entry lifecycle
rather than writing complex db functions and events

payload cms also provides a REST api and GraphQL api, which can ensure that we
can write our config file in such a way that it supports the current REST API
standars

If migrating to such services is a hassel at the moment,
scaling can be a current challege too, to resolve such challenges I would suggest

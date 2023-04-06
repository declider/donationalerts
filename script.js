async function auth(access_token) {
    let res = await fetch('https://donationalerts-1-h8829158.deta.app/auth?access_token='+access_token, {
        method: "get"
    })
    return (await res.json())
}

let url = new URL("https://www.donationalerts.com/oauth/authorize?client_id=10715&redirect_uri=https://declider.github.io/donationalerts/&response_type=token&force_verify=true")
let scopes = ["oauth-user-show","oauth-donation-subscribe"]

const access_token_el = document.getElementById("access_token")
const socket_connection_token_el = document.getElementById("socket_connection_token")
const id_el = document.getElementById("id")


async function main() {

    if(scopes.length===0) {
        url.searchParams.delete("scope")
    } else {
        let scope_param = scopes.join("+")
        url.searchParams.append("scope", scope_param)
    }

    if(window.location.hash){
        let hash = window.location.hash
        let access_token = hash.split("&")[0].replace("#access_token=","").trim()
        access_token_el.value = access_token

        let data = await auth(access_token)
        let socket_connection_token = data.socket_connection_token
        socket_connection_token_el.value = socket_connection_token
        let id = data.id
        id_el.value = id

        document.getElementById("copy_all").style.visibility = "visible"
    }
}



function changeScopes(e) {
    let el = e.srcElement
    if(el.checked) {
        scopes.push(el.dataset.scope)
    } else {
        let index = scopes.indexOf(el.dataset.scope)
        scopes.splice(index, 1)
    }
    console.log(scopes)

    if(scopes.length===0) {
        url.searchParams.delete("scope")
    } else {
        let scope_param = scopes.join("+")
        url.searchParams.set("scope", scope_param)
    }
}

function open_link() {
    if(scopes.length!==0) {
        window.open(url.toString().replaceAll("%2B","+"),"_self")
    }
}



function copy(element) {
    let value = document.getElementById(element).value
    navigator.clipboard.writeText(value)
}

function copy_all() {
    let data = {}
    data['access_token'] = access_token_el.value
    data['socket_connection_token'] = socket_connection_token_el.value
    data['id'] = id_el.value
    navigator.clipboard.writeText(data)
}

main()

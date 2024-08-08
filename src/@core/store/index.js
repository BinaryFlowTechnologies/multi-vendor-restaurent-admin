import { createStore } from "vuex"
import auth from "@core/store/modules/auth"
import role from "@core/store/modules/acl/role"
import permission from "@core/store/modules/acl/permission"
import user from "@core/store/modules/acl/user"

export default createStore({
  modules: {
    auth,
    user,
    role,
    permission,
  },
})
import * as express from 'express';
import ApiResponse from "../../utils/response";
import rolesRoutes from "./role/role.routes";
import RecipeRoutes from "./recipes/recipe.routes";
import RestaurantRoutes from "./restaurants/restaurant.routes";
import StateRoutes from "./state/state.routes";
import SearchRoutes from "./search/search.routes";
import authRoutes from "./auth/auth.routes";
import UserRoutes from "./users/user.routes";

const router = express.Router();

router.get('/test-api', (req, res) => {
    return ApiResponse.success({ res, payload: { test: 'test' } });
});

router.use('/auth', authRoutes)
router.use('/roles', rolesRoutes)
router.use('/recipes', RecipeRoutes)
router.use('/restaurants', RestaurantRoutes)
router.use('/states', StateRoutes)
router.use('/search', SearchRoutes)
router.use('/users', UserRoutes)

export default router;

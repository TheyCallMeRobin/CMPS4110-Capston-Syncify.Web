using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Features.Recipes;

namespace Syncify.Web.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipesController : ControllerBase
    {
        private readonly DataContext _context;

        public RecipesController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes()
        {
            var recipes = await _context.Recipes.Include(r => r.User).ToListAsync();
            return Ok(recipes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Recipe>> GetRecipe(int id)
        {
            var recipe = await _context.Recipes.Include(r => r.User)
                                               .FirstOrDefaultAsync(r => r. RecipeId == id);

            if (recipe == null)
            {
                return NotFound();
            }

            return Ok(recipe);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipesByUser(int userId)
        {
            var recipes = await _context.Recipes.Where(r => r.CreatorUserId == userId).ToListAsync();

            if (recipes == null || !recipes.Any())
            {
                return NotFound();
            }

            return Ok(recipes);
        }
    }
}

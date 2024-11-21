import React, { useMemo } from 'react';
import { useAsync } from 'react-use';
import { RecipesService } from '../api/generated/RecipesService.ts';
import { RecipeGetDto } from '../api/generated/index.defs.ts';
import { cardStyle } from './MainPage.tsx';
import { LoadingContainer } from '../Components/loading-container.tsx';
import { FaUtensils } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const RecipeOfTheDay: React.FC = () => {
  const fetchRecipes = useAsync(async () => {
    const response = await RecipesService.getRecipeOfTheDay();
    if (response.hasErrors) {
      return;
    }

    return response.data;
  }, []);

  return (
      <div className={'card mb-4 shadow dashboard-card'} style={cardStyle}>
      <div className={'card-header primary-bg text-white hstack gap-2'}>
        <div>
          <FaUtensils />
        </div>
        <div>Recipe of the Day</div>
      </div>
      <div className={'card-body'}>
        <LoadingContainer loading={fetchRecipes.loading}>
          <div className={'vstack gap-3'}>
            <div>
              <RecipeDisplay recipe={fetchRecipes.value} />
            </div>
            <div>
              <Link to="/recipes" className={'btn btn-primary'}>
                View Recipe
              </Link>
            </div>
          </div>
        </LoadingContainer>
      </div>
    </div>
  );
};

type RecipeDisplayProps = {
  recipe?: RecipeGetDto | null;
};

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  const cookTime = useMemo(
    () =>
      !recipe?.cookTimeInSeconds || recipe.cookTimeInSeconds === 0 ? (
        <span>&ndash; &ndash;</span>
      ) : (
        <>{Math.round(recipe.cookTimeInSeconds / 60)} minutes</>
      ),
    [recipe?.cookTimeInSeconds]
  );

  const prepTime = useMemo(
    () =>
      !recipe?.prepTimeInSeconds || recipe.prepTimeInSeconds === 0 ? (
        <span>&ndash; &ndash;</span>
      ) : (
        <>{Math.round(recipe.prepTimeInSeconds / 60)} minutes</>
      ),
    [recipe?.prepTimeInSeconds]
  );

  if (!recipe) return <>No recipe today. Come back tomorrow!</>;

  return (
    <>
      <div className={'row'}>
        <div className={'vstack'}>
          <h5>{recipe.name}</h5>
          <p className={'fst-italic'}>{recipe.description}</p>
        </div>
        <br />
        <div className={'col-md-4 col-sm-4'}>
          <div className={'col fw-bold'}>Prep Time</div>
          <div className={'col'}>{prepTime}</div>
        </div>
        <div className={'col-md-4 col-sm-4'}>
          <div className={'col fw-bold'}>Cook Time</div>
          <div className={'col'}>{cookTime}</div>
        </div>
        <div className={'col-md-4 col-sm-4'}>
          <div className={'col fw-bold'}>Servings</div>
          <div className={'col'}>{recipe.servings}</div>
        </div>
      </div>
    </>
  );
};

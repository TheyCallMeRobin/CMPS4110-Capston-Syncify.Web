// src/Recipes.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Modal from 'react-modal';
import './recipe.css';
import Melon from '../../Images/Melon.jpg';
import Pear from '../../Images/Pear.jpg';
import RandomFood from '../../Images/Random Food.jpg';

Modal.setAppElement('#root');

const recipeData = [
    {
        id: 1,
        title: 'Melon Drama Delight',
        image: Melon,
        bio: 'This is just a melon, however long it takes you to go to grocery store.',
        timeToPrepare: '15 minutes',
        author: 'Chef Melon',
        moreInfoLink: '/recipes',
    },
    {
        id: 2,
        title: 'Pair-a-dise Pearfection',
        image: Pear,
        bio: 'This is just a pear.',
        timeToPrepare: 'How long it takes you to go to grocery store',
        author: 'Chef Pear',
        moreInfoLink: '/recipes',
    },
    {
        id: 3,
        title: 'Chaos Cuisine Medley',
        image: RandomFood,
        bio: 'AHHHHHHHHHHHHHHHHHHHHHHHH!',
        timeToPrepare: '40 decades',
        author: 'Chef Chaos',
        moreInfoLink: '/recipes',
    },
];

export const Recipes: React.FC = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

    const openModal = (recipe: any) => {
        setSelectedRecipe(recipe);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedRecipe(null);
    };

    return (
        <div className="container">
            <div className="content">
                {recipeData.map((recipe) => (
                    <div
                        key={recipe.id}
                        className="section"
                        onClick={() => openModal(recipe)}
                    >
                        <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                        <p className="recipe-title">{recipe.title}</p>
                    </div>
                ))}
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="modal"
                overlayClassName="modal-overlay"
            >
                {selectedRecipe && (
                    <div className="modal-content">
                        <h2>{selectedRecipe.title}</h2>
                        <img src={selectedRecipe.image} alt={selectedRecipe.title} />
                        <p>{selectedRecipe.bio}</p>

                        <p><strong>Time to Prepare:</strong> {selectedRecipe.timeToPrepare}</p>

                        <p><strong>Author:</strong> {selectedRecipe.author}</p>

                        <button
                            onClick={() => window.open(selectedRecipe.moreInfoLink, '_blank')}
                            className="more-info-button"
                        >
                            More Info
                        </button>
                        <button onClick={closeModal}>Close</button>
                    </div>
                )}
            </Modal>
            <Outlet />
        </div>
    );
};

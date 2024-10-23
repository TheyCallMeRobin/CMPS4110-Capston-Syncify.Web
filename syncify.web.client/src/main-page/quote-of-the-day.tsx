import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';
import { useAsync } from 'react-use';
import { LoadingContainer } from '../Components/loading-container.tsx';
import { QuoteService } from '../api/generated/QuoteService.ts';
import { toast } from 'react-toastify';

export const QuoteOfTheDay: React.FC = () => {
  const fetchQuote = useAsync(async () => {
    const response = await QuoteService.getQuoteOfTheDay();

    if (response.hasErrors) {
      response.errors.forEach((error) => toast.error(error.errorMessage));
      return;
    }

    return response.data;
  });

  return (
    <div className={'card mb-4 shadow dashboard-card'}>
      <div className={'card-header primary-bg text-white hstack gap-2'}>
        <div>
          <FaQuoteLeft />
        </div>
        <div>Quote of the Day</div>
      </div>
      <div className={'card-body'}>
        <LoadingContainer loading={fetchQuote.loading}>
          <div className={'vstack gap-1'}>
            <div>
              <p className={'fst-italic'}>"{fetchQuote.value?.q}"</p>
            </div>
            <div>&ndash; {fetchQuote.value?.a}</div>
          </div>
        </LoadingContainer>
      </div>
    </div>
  );
};

import React from 'react'
import "./SummarySection.css"
import OrderSummary from './summarycards/OrderSummary'
import RevenueCard from './summarycards/RevenueCard'
import TablesCard from './summarycards/TablesCard'

const SummarySection = ({filterText}) => {
  const cards = [
    { label: "Order Summary", component: <OrderSummary /> },
    { label: "Revenue", component: <RevenueCard /> },
    { label: "Tables", component: <TablesCard /> },
  ];

  const filteredCards = cards.map((card) => {
    const isVisible = card.label
      .toLowerCase()
      .includes(filterText.toLowerCase().trim());
    return { ...card, isVisible };
  });

  return (
    <div className='summary-section'>
        {filteredCards.map((card, index) => (
        <div
          key={index}
          className={`summary-card-wrapper ${!card.isVisible ? "blurred" : ""}`}
        >
          {card.component}
        </div>
      ))}
    </div>
  )
}

export default SummarySection
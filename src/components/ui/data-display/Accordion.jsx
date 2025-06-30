import { useState } from 'react';
import { tv } from 'tailwind-variants';
import { Plus, Minus } from "@phosphor-icons/react";

const accordionStyles = tv({
  slots: {
    container: 'flex flex-col gap-5 w-full',
    item: 'bg-white/5 rounded-2xl overflow-hidden transition-all duration-300 border border-white/10 hover:translate-y-[-2px] hover:border-white/20 hover:bg-white/10',
    itemActive: 'bg-white/10 border-white/20',
    trigger: 'w-full p-6 flex items-center justify-between gap-5 bg-transparent border-0 cursor-pointer transition-all duration-300 hover:bg-white/5 focus-visible:outline-light-green-6 focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
    triggerActive: 'border-b border-white/10',
    title: 'flex-1 text-left text-lg font-medium text-light-green-6',
    icon: 'text-light-green-6 transition-all duration-300',
    content: 'max-h-0 px-6 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
    contentActive: 'max-h-[500px] p-6 pt-5 pb-7',
    contentInner: 'text-light-green-6 text-base leading-relaxed opacity-90',
  },
  variants: {
    size: {
      default: {},
      sm: {
        trigger: 'p-6',
        title: 'text-base',
        content: 'px-6',
        contentActive: 'p-6',
      },
      xs: {
        item: 'rounded-lg',
        trigger: 'p-4',
        title: 'text-sm',
        content: 'px-4',
        contentActive: 'p-4',
        contentInner: 'text-sm',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const Accordion = ({ items, size }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const styles = accordionStyles({ size });

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <div className={styles.container()}>
      {items.map((item, index) => {
        const isActive = activeIndex === index;

        return (
          <div
            key={index}
            className={`${styles.item()} ${isActive ? styles.itemActive() : ''}`}
          >
            <button
              className={`${styles.trigger()} ${isActive ? styles.triggerActive() : ''}`}
              onClick={() => toggleAccordion(index)}
              aria-expanded={isActive}
            >
              <span className={styles.title()}>{item.title}</span>
              {isActive ? (
                <Minus size={24} weight="bold" className={styles.icon()} />
              ) : (
                <Plus size={24} weight="bold" className={styles.icon()} />
              )}
            </button>

            <div className={`${styles.content()} ${isActive ? styles.contentActive() : ''}`}>
              <div className={styles.contentInner()}>
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
(function () {
  function init() {
    document.querySelectorAll('[data-featured-products]').forEach(function (section) {
      section.querySelectorAll('[data-featured-card]').forEach(function (card) {
        var variantsJson = card.querySelector('[data-variants-json]');
        var swatches = card.querySelector('[data-swatches]');
        var primaryImg = card.querySelector('.fp-card__img-primary');
        var secondaryImg = card.querySelector('.fp-card__img-secondary');
        var priceEl = card.querySelector('[data-price]');
        var badgeSale = card.querySelector('[data-badge="sale"]');
        var badgeSoldOut = card.querySelector('[data-badge="sold-out"]');
        if (!variantsJson || !swatches) return;

        var variants = [];
        try {
          variants = JSON.parse(variantsJson.textContent);
        } catch (e) {
          return;
        }

        function findVariantByOption1(value) {
          return variants.find(function (v) {
            return (v.option1 || '').toLowerCase() === (value || '').toLowerCase();
          });
        }

        function setActiveSwatch(optionValue) {
          swatches.querySelectorAll('[data-swatch]').forEach(function (btn) {
            if (btn.getAttribute('data-option-value') === optionValue) {
              btn.classList.add('fp-card__swatch--selected');
            } else {
              btn.classList.remove('fp-card__swatch--selected');
            }
          });
        }

        function updateCard(variant) {
          if (!variant) return;
          if (primaryImg && variant.primary_src) {
            primaryImg.src = variant.primary_src;
            primaryImg.srcset = variant.primary_src + ' 1x';
          }
          if (secondaryImg && variant.secondary_src) {
            secondaryImg.src = variant.secondary_src;
            secondaryImg.srcset = variant.secondary_src + ' 1x';
          } else if (secondaryImg) {
            secondaryImg.src = variant.primary_src || '';
            secondaryImg.srcset = '';
          }
          if (priceEl) {
            var compareAt = variant.compare_at_price;
            var price = variant.price;
            var onSale = compareAt && compareAt > price;
            var priceFmt = variant.price_formatted || '';
            var compareFmt = variant.compare_at_price_formatted || '';
            var html = '';
            if (onSale && compareFmt) {
              html =
                '<span class="fp-card__price-compare tw-mr-3.5">' +
                compareFmt +
                '</span><span class="fp-card__price-sale">' +
                priceFmt +
                '</span>';
            } else {
              html = '<span class="fp-card__price-regular">' + priceFmt + '</span>';
            }
            priceEl.innerHTML = html;
          }
          if (badgeSoldOut) {
            badgeSoldOut.style.display = variant.available ? 'none' : 'block';
          }
          if (badgeSale) {
            var compareAt = variant.compare_at_price;
            var price = variant.price;
            var onSale = variant.available && compareAt && compareAt > price;
            badgeSale.style.display = onSale ? 'block' : 'none';
          }
          setActiveSwatch(variant.option1);
        }

        swatches.querySelectorAll('[data-swatch]').forEach(function (btn) {
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var value = btn.getAttribute('data-option-value');
            var variant = findVariantByOption1(value);
            if (variant) updateCard(variant);
          });
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('shopify:section:load', init);
})();

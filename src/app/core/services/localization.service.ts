import { DOCUMENT } from '@angular/common';
import { effect, Injectable, computed, inject, signal } from '@angular/core';

export type Locale = 'en' | 'ar';
const STORAGE_KEY = 'food-haven-locale';

const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.favorites': 'Favorites',
    'nav.enterprise': 'Enterprise',
    'nav.cart': 'Cart',
    'nav.login': 'Login',
    'nav.signUp': 'Sign Up',
    'nav.profile': 'Profile',
    'nav.language': 'عربي',
    'theme.light': 'Light',
    'theme.dark': 'Dark',

    'auth.welcomeBack': 'Welcome Back.',
    'auth.signIn': 'Sign In',
    'auth.continue': 'Continue your food journey',
    'auth.remember': 'Remember me',
    'auth.forgot': 'Forgot Password?',
    'auth.orContinue': 'OR CONTINUE WITH',
    'auth.hasAccount': 'Don’t have an account?',
    'auth.createAccount': 'Create Your Account.',
    'auth.signUp': 'Sign Up',
    'auth.startJourney': 'Start your premium food journey',
    'auth.alreadyAccount': 'Already have an account?',
    'auth.signInHere': 'Sign In',
    'auth.terms': 'I agree to the Terms & Conditions',

    'auth.feature.premium': 'Premium Recipes',
    'auth.feature.fast': 'Fast Delivery',
    'auth.feature.topRated': 'Top Rated Meals',
    'auth.feature.meals': 'Premium Meals',
    'auth.feature.ordering': 'Fast Ordering',
    'auth.feature.exclusive': 'Exclusive Recipes',

    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.fullName': 'Full Name',
    'auth.confirmPassword': 'Confirm Password',
    'auth.createAccountBtn': 'Create Account',
    'auth.submit': 'Sign In',
    'auth.emailRequired': 'Email is required',
    'auth.emailInvalid': 'Enter a valid email',
    'auth.passwordRequired': 'Password is required',
    'auth.passwordMin': 'Password must be at least 6 characters',
    'auth.nameRequired': 'Name is required',
    'auth.nameMin': 'Name must be at least 3 characters',
    'auth.passwordMismatch': 'Passwords do not match',
    'auth.enterEmail': 'Enter your email',
    'auth.enterPassword': 'Enter your password',
    'auth.createPassword': 'Create password',
    'auth.confirmPasswordPlaceholder': 'Confirm password',
    'auth.invalidLogin': 'Invalid email or password',
    'auth.loginFailed': 'Login Failed',
    'auth.loginSuccessful': 'Login Successful',
    'auth.emailExists': 'Email already exists',
    'auth.enterName': 'Enter your full name',

    'home.heroTitle': 'Savor the Finest Flavors',
    'home.heroSubtitle':
      'Experience culinary excellence delivered straight to your door. Fast, fresh, and unforgettable.',
    'home.searchPlaceholder': 'What are you craving today? (e.g., Chicken, Pizza, Pasta)',
    'home.searchBtn': 'Search',
    'home.exploreMenu': 'Explore Menu',
    'home.orderNow': 'Order Now',
    'home.recentSearch': 'Recent Searches',
    'home.clearAll': 'Clear All',
    'home.flashPromotions': 'Flash Promotions',
    'home.smartRecommendations': 'Smart Recommendations',
    'home.mealsWeLove': "Meals we think you'll love",
    'home.featured': "Today's Specials",
    'home.filterCategory': 'Filter by Category',
    'home.filterArea': 'Filter by Area',
    'home.filterIngredient': 'Filter by Ingredient',
    'home.sortBy': 'Sort By',
    'home.default': 'Default',
    'home.nameAsc': 'Name A-Z',
    'home.nameDesc': 'Name Z-A',
    'home.ratingDesc': 'Highest Rated',
    'home.reset': 'Reset',
    'home.noMeals': 'No meals found',
    'home.tryDifferent': 'Try a different search term or reset filters',

    'profile.membershipTier': 'Membership Tier',
    'profile.loyaltyPoints': 'loyalty points',
    'profile.tierBenefits': 'Tier Benefits',
    'profile.favorites': 'Favorites',
    'profile.orders': 'Orders',
    'profile.loyaltyProgress': 'Loyalty Progress',
    'profile.theme': 'Theme',
    'profile.switchTheme': 'Switch between light and dark mode',
    'profile.orderHistory': 'Order History',
    'profile.viewOrders': 'View Orders',
    'profile.dangerZone': 'Danger Zone',
    'profile.logout': 'Log Out',
    'profile.nextReward': '{{points}} points to next premium reward',

    'cart.yourCart': 'Your Cart',
    'cart.delicious': 'Delicious meals waiting for checkout',
    'cart.items': '{{count}} Items',
    'cart.smartAddons': 'Smart Add-ons',
    'cart.addonsSubtitle': 'Boost your order with curated pairings and premium bundles.',
    'cart.coupon': 'Coupon Code',
    'cart.apply': 'Apply',
    'cart.couponApplied': '🎉 Coupon Applied Successfully',
    'cart.invalidPromo': 'Invalid or ineligible promo code.',
    'cart.memberTier': 'Member tier',
    'cart.points': 'Points',
    'cart.earnPoints': 'Earn {{points}} points with this order.',
    'cart.availableOffers': 'Available Offers',
    'cart.subtotal': 'Subtotal',
    'cart.discount': 'Discount',
    'cart.delivery': 'Delivery',
    'cart.free': 'Free',
    'cart.total': 'Total',
    'cart.placeOrder': 'Place Order',
    'cart.orderSuccess':
      'Order placed successfully. You earned {{points}} loyalty points and your {{tier}} benefits are active!',
    'cart.fastDelivery': 'Fast Delivery',
    'cart.priorityOrder': 'Priority order processing and extra rewards.',
    'cart.orderSummary': 'Order Summary',
    'cart.specialInstructions': 'Special instructions',
    'cart.instructionsPlaceholder': 'Add any special requests for this meal',
    'cart.addItemsCheckout': 'Add items to checkout.',
    'cart.estimate': '30 - 45 mins estimated',
    'cart.emptyTitle': 'Your cart is empty',
    'cart.emptySubtitle': 'Add some delicious meals to continue',
    'cart.browseMenu': 'Browse Menu',

    'orderHistory.title': 'Order History',
    'orderHistory.subtitle': 'Track and review your past orders',
    'orderHistory.totalOrders': 'Total Orders',
    'orderHistory.totalSpent': 'Total Spent',
    'orderHistory.favoriteDish': 'Favorite Dish',
    'orderHistory.reorder': 'Reorder',
    'orderHistory.orderId': 'Order ID',
    'orderHistory.date': 'Date',
    'orderHistory.status': 'Status',
    'orderHistory.total': 'Total',
    'orderHistory.reorderSuccess': 'Order items added to cart for reorder.',
    'orderHistory.noOrders': 'No orders yet',
    'orderHistory.browseMenu': 'Browse Menu',
    'orderHistory.quantity': 'Qty:',

    'mealDetails.back': 'Back to Home',
    'mealDetails.tags': 'Tags',
    'mealDetails.reviews': '{{count}}+ Reviews',
    'mealDetails.quantity': 'Quantity:',
    'mealDetails.addToCart': 'Add To Cart',
    'mealDetails.favoriteSaved': '❤️ Saved',
    'mealDetails.ingredients': 'Ingredients',
    'mealDetails.instructions': 'Cooking Instructions',
    'mealDetails.video': 'Video Tutorial',
    'mealDetails.similar': 'You May Also Like',
    'mealDetails.loadError': 'Unable to load meal details.',
    'mealDetails.notFound': 'Meal details not found.',
    'mealDetails.failedLoad': 'Failed to load meal details.',
    'mealDetails.addedToCart': '{{quantity}}x {{meal}} added to cart!',
    'mealDetails.addedToFavorites': '{{meal}} added to favorites',
    'mealDetails.removedFromFavorites': '{{meal}} removed from favorites',
    'mealDetails.favorite': 'Favorite',

    'favorites.title': 'Favorites',
    'favorites.subtitle': 'Your saved premium meals',

    'enterprise.disabled': 'Enterprise dashboard is currently unavailable.',
    'enterprise.subtitle': 'Contact support to enable your workspace.',

    'general.learnMore': 'Learn More',
    'general.shopNow': 'Shop Now',
    'general.loading': 'Loading...',
    'general.search': 'Search',

    'home.whatYouGet': 'What you get',
    'home.benefit1': 'Complimentary premium support',
    'home.benefit2': 'Exclusive flash deals every week',
    'home.benefit3': 'Personalized menu recommendations',
    'home.benefit4': 'Priority order dispatch & live tracking',
    'home.statPremiumOrders': 'Premium orders',
    'home.statAverageRating': 'Average rating',
    'home.statTopChefs': 'Top chefs',
    'home.statFastDelivery': 'Fast delivery',
    'home.categoryCake': 'Cake',
    'home.categoryMuffins': 'Muffins',
    'home.categoryCroissant': 'Croissant',
    'home.categoryBread': 'Bread',
    'home.categoryTart': 'Tart',
    'home.categoryFavorite': 'Favorite',
    'home.badgeBestSeller': 'Best Seller',
    'home.badgePremium': 'Premium',
    'home.badgeTrending': 'Trending',
    'home.badgeNew': 'New',
    'home.badgeChefsPick': 'Chef’s Pick',
    'home.premiumBakeryItem': 'Premium bakery item with signature ingredients.',
    'home.specialOffer': 'Special Offer',
    'home.20OffFirstOrder': '20% Off Your First Order',
    'home.useCodePremium20': 'Use code PREMIUM20 at checkout to unlock exclusive welcome savings.',
    'home.claimOffer': 'Claim Offer',
    'home.add': 'Add',

    'profile.loyaltyProgressLabel': 'Loyalty progress',
    'profile.pointsToNextReward': '{{points}} points to next premium reward',

    'cart.highlightExtraPoints': 'Extra points',
    'cart.highlightFreeDelivery': 'Free delivery',
    'cart.highlightFasterDispatch': 'Faster dispatch',
    'cart.highlight5xRewards': '5x rewards',
    'cart.highlightOnOrders35Plus': 'On orders $35+',
    'cart.highlightPriorityHandling': 'Priority handling',
    'cart.bundleAdded': '{{itemName}} added to your cart as a smart bundle.',
    'cart.appliedPromoLabel': 'Applied {{label}}: {{description}}',

    'orderHistory.statusDelivered': 'Delivered',
    'orderHistory.statusShipped': 'Shipped',
    'orderHistory.statusPending': 'Pending',

    'featured.sectionLabel': 'Why Food Haven',
    'featured.sectionTitle': 'Modern features designed for food lovers',
    'featured.joinToday': 'Join Today',
    'featured.fastDelivery': 'Fast Delivery',
    'featured.fastDeliveryDesc': 'Get your meal hot and ready with reliable, same-day delivery.',
    'featured.freshIngredients': 'Fresh Ingredients',
    'featured.freshIngredientsDesc':
      'Every dish is made with fresh produce and premium seasonal ingredients.',
    'featured.secureCheckout': 'Secure Checkout',
    'featured.secureCheckoutDesc':
      'Enjoy seamless payment flow with secure checkout and instant confirmation.',
    'featured.chefsPicks': 'Chef’s Picks',
    'featured.chefsPicksDesc':
      'Handpicked meals curated by top chefs for a premium dining experience.',
    'featured.badgeTrending': 'Trending',
    'featured.badgeNew': 'New',
    'featured.badgeSafe': 'Safe',
    'featured.badgePremium': 'Premium',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.favorites': 'المفضلة',
    'nav.enterprise': 'الادارة',
    'nav.cart': 'السلة',
    'nav.login': 'تسجيل الدخول',
    'nav.signUp': 'إنشاء حساب',
    'nav.profile': 'الحساب',
    'nav.language': 'EN',
    'theme.light': 'فاتح',
    'theme.dark': 'داكن',

    'auth.welcomeBack': 'مرحبًا بعودتك.',
    'auth.signIn': 'تسجيل الدخول',
    'auth.continue': 'تابع رحلة الطعام الخاصة بك',
    'auth.remember': 'تذكرني',
    'auth.forgot': 'نسيت كلمة المرور؟',
    'auth.orContinue': 'أو المتابعة عبر',
    'auth.hasAccount': 'لا تملك حسابًا؟',
    'auth.createAccount': 'أنشئ حسابك.',
    'auth.startJourney': 'ابدأ رحلة الطعام المميزة الخاصة بك',
    'auth.alreadyAccount': 'هل لديك حساب بالفعل؟',
    'auth.signInHere': 'سجل الدخول',
    'auth.terms': 'أوافق على الشروط والأحكام',

    'auth.feature.premium': 'وصفات مميزة',
    'auth.feature.fast': 'توصيل سريع',
    'auth.feature.topRated': 'وجبات الأعلى تقييمًا',
    'auth.feature.meals': 'وجبات مميزة',
    'auth.feature.ordering': 'طلب سريع',
    'auth.feature.exclusive': 'وصفات حصرية',

    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.fullName': 'الاسم الكامل',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.createAccountBtn': 'إنشاء حساب',
    'auth.submit': 'تسجيل الدخول',
    'auth.emailRequired': 'البريد الإلكتروني مطلوب',
    'auth.emailInvalid': 'أدخل بريدًا إلكترونيًا صالحًا',
    'auth.passwordRequired': 'كلمة المرور مطلوبة',
    'auth.passwordMin': 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
    'auth.nameRequired': 'الاسم مطلوب',
    'auth.nameMin': 'يجب أن يكون الاسم 3 أحرف على الأقل',
    'auth.passwordMismatch': 'كلمات المرور غير متطابقة',
    'auth.enterEmail': 'أدخل بريدك الإلكتروني',
    'auth.enterPassword': 'أدخل كلمة المرور',
    'auth.createPassword': 'أنشئ كلمة مرور',
    'auth.confirmPasswordPlaceholder': 'تأكيد كلمة المرور',
    'auth.invalidLogin': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    'auth.loginFailed': 'فشل تسجيل الدخول',
    'auth.loginSuccessful': 'تم تسجيل الدخول بنجاح',
    'auth.emailExists': 'البريد الإلكتروني موجود بالفعل',
    'auth.enterName': 'أدخل اسمك الكامل',

    'home.heroTitle': 'تذوق أرقى النكهات',
    'home.heroSubtitle': 'استمتع بأفضل الأطباق تُوصل إلى بابك. طازجة، سريعة، ولا تُنسى.',
    'home.searchPlaceholder': 'ماذا ترغب أن تتناول اليوم؟ (مثل: دجاج، بيتزا، باستا)',
    'home.searchBtn': 'بحث',
    'home.exploreMenu': 'اكتشف القائمة',
    'home.orderNow': 'اطلب الآن',
    'home.recentSearch': 'آخر عمليات البحث',
    'home.clearAll': 'مسح الكل',
    'home.flashPromotions': 'عروض فلاش',
    'home.smartRecommendations': 'توصيات ذكية',
    'home.mealsWeLove': 'وجبات نعتقد أنك ستحبها',
    'home.featured': 'عروض اليوم',
    'home.filterCategory': 'التصفية حسب التصنيف',
    'home.filterArea': 'التصفية حسب المنطقة',
    'home.filterIngredient': 'التصفية حسب المكون',
    'home.sortBy': 'ترتيب حسب',
    'home.default': 'افتراضي',
    'home.nameAsc': 'الاسم أ-ي',
    'home.nameDesc': 'الاسم ي-أ',
    'home.ratingDesc': 'الأعلى تقييماً',
    'home.reset': 'إعادة تعيين',
    'home.noMeals': 'لم يتم العثور على وجبات',
    'home.tryDifferent': 'جرب كلمة بحث مختلفة أو أعد تعيين الفلاتر',

    'profile.membershipTier': 'فئة العضوية',
    'profile.loyaltyPoints': 'نقاط الولاء',
    'profile.tierBenefits': 'مزايا الفئة',
    'profile.favorites': 'المفضلة',
    'profile.orders': 'الطلبات',
    'profile.loyaltyProgress': 'تقدم الولاء',
    'profile.theme': 'الثيم',
    'profile.switchTheme': 'التبديل بين الوضع الفاتح والداكن',
    'profile.orderHistory': 'تاريخ الطلبات',
    'profile.viewOrders': 'عرض الطلبات',
    'profile.dangerZone': 'منطقة الخطر',
    'profile.logout': 'تسجيل الخروج',
    'profile.nextReward': 'تبقى {{points}} نقطة للحصول على المكافأة التالية',

    'cart.yourCart': 'سلة التسوق',
    'cart.delicious': 'وجبات لذيذة تنتظر السداد',
    'cart.items': '{{count}} عناصر',
    'cart.smartAddons': 'إضافات ذكية',
    'cart.addonsSubtitle': 'عزز طلبك بمنتجات مكملة ومنتجات مميزة.',
    'cart.coupon': 'كود الخصم',
    'cart.apply': 'تطبيق',
    'cart.couponApplied': '🎉 تم تطبيق الخصم بنجاح',
    'cart.invalidPromo': 'كود خصم غير صالح أو غير مؤهل.',
    'cart.memberTier': 'فئة العضوية',
    'cart.points': 'النقاط',
    'cart.earnPoints': 'اكسب {{points}} نقاط مع هذا الطلب.',
    'cart.availableOffers': 'العروض المتاحة',
    'cart.subtotal': 'المجموع الفرعي',
    'cart.discount': 'الخصم',
    'cart.delivery': 'التوصيل',
    'cart.free': 'مجاني',
    'cart.total': 'الإجمالي',
    'cart.placeOrder': 'إتمام الطلب',
    'cart.orderSuccess':
      'تم إرسال الطلب بنجاح. لقد حصلت على {{points}} نقطة ولاء وفوائد {{tier}} مفعلة!',
    'cart.fastDelivery': 'توصيل سريع',
    'cart.priorityOrder': 'معالجة طلب أولوية ومكافآت إضافية.',
    'cart.orderSummary': 'ملخص الطلب',
    'cart.specialInstructions': 'تعليمات خاصة',
    'cart.instructionsPlaceholder': 'أضف أي طلبات خاصة لهذا الطبق',
    'cart.addItemsCheckout': 'أضف عناصر لإتمام الدفع.',
    'cart.estimate': '30 - 45 دقيقة متوقعة',
    'cart.emptyTitle': 'سلة التسوق فارغة',
    'cart.emptySubtitle': 'أضف بعض الوجبات اللذيذة للمتابعة',
    'cart.browseMenu': 'استعرض القائمة',

    'orderHistory.title': 'تاريخ الطلبات',
    'orderHistory.subtitle': 'تتبع وراجع طلباتك السابقة',
    'orderHistory.totalOrders': 'إجمالي الطلبات',
    'orderHistory.totalSpent': 'إجمالي الإنفاق',
    'orderHistory.favoriteDish': 'الطبق المفضل',
    'orderHistory.reorder': 'إعادة الطلب',
    'orderHistory.orderId': 'رقم الطلب',
    'orderHistory.date': 'التاريخ',
    'orderHistory.status': 'الحالة',
    'orderHistory.total': 'الإجمالي',
    'orderHistory.reorderSuccess': 'تمت إضافة عناصر الطلب إلى السلة لإعادة الطلب.',
    'orderHistory.noOrders': 'لا يوجد طلبات حتى الآن',
    'orderHistory.browseMenu': 'استعرض القائمة',

    'mealDetails.back': 'العودة إلى الرئيسية',
    'mealDetails.tags': 'التصنيفات',
    'mealDetails.reviews': '{{count}}+ تقييمات',
    'mealDetails.quantity': 'الكمية:',
    'mealDetails.addToCart': 'أضف إلى السلة',
    'mealDetails.favoriteSaved': '❤️ تم الحفظ',
    'mealDetails.ingredients': 'المكونات',
    'mealDetails.instructions': 'تعليمات الطهي',
    'mealDetails.video': 'فيديو تعليمي',
    'mealDetails.similar': 'قد يعجبك أيضًا',
    'mealDetails.loadError': 'يتعذر تحميل تفاصيل الوجبة.',
    'mealDetails.notFound': 'لم يتم العثور على تفاصيل الوجبة.',
    'mealDetails.failedLoad': 'فشل في تحميل تفاصيل الوجبة.',
    'mealDetails.addedToCart': 'تمت إضافة {{quantity}}x {{meal}} إلى السلة!',
    'mealDetails.addedToFavorites': 'تمت إضافة {{meal}} إلى المفضلة',
    'mealDetails.removedFromFavorites': 'تمت إزالة {{meal}} من المفضلة',
    'mealDetails.favorite': 'المفضلة',

    'favorites.title': 'المفضلة',
    'favorites.subtitle': 'وجباتك المميزة المحفوظة',

    'enterprise.disabled': 'لوحة الإدارة غير متاحة حالياً.',
    'enterprise.subtitle': 'اتصل بالدعم لتمكين مساحة العمل.',

    'general.learnMore': 'تعرف على المزيد',
    'general.shopNow': 'تسوق الآن',
    'general.loading': 'جارٍ التحميل...',
    'general.search': 'بحث',

    'home.whatYouGet': 'ماذا تحصل عليه',
    'home.benefit1': 'دعم مميز مجاني',
    'home.benefit2': 'عروض سريعة حصرية كل أسبوع',
    'home.benefit3': 'توصيات قائمة طعام شخصية',
    'home.benefit4': 'إرسال طلب ذو أولوية وتتبع مباشر',
    'home.statPremiumOrders': 'طلبات مميزة',
    'home.statAverageRating': 'متوسط التقييم',
    'home.statTopChefs': 'أفضل الطهاة',
    'home.statFastDelivery': 'توصيل سريع',
    'home.categoryCake': 'كيك',
    'home.categoryMuffins': 'مافين',
    'home.categoryCroissant': 'كرواسون',
    'home.categoryBread': 'خبز',
    'home.categoryTart': 'تارت',
    'home.categoryFavorite': 'المفضلة',
    'home.badgeBestSeller': 'الأكثر مبيعاً',
    'home.badgePremium': 'مميز',
    'home.badgeTrending': 'رائج',
    'home.badgeNew': 'جديد',
    'home.badgeChefsPick': 'اختيار الشيف',
    'home.premiumBakeryItem': 'عنصر مخبز مميز بمكونات مميزة.',
    'home.specialOffer': 'عرض خاص',
    'home.20OffFirstOrder': 'خصم 20% على طلبك الأول',
    'home.useCodePremium20': 'استخدم الرمز PREMIUM20 عند الدفع لفتح توفيرات ترحيبية حصرية.',
    'home.claimOffer': 'احصل على العرض',
    'home.add': 'إضافة',

    'profile.loyaltyProgressLabel': 'تقدم الولاء',
    'profile.pointsToNextReward': '{{points}} نقطة للحصول على المكافأة التالية',

    'cart.highlightExtraPoints': 'نقاط إضافية',
    'cart.highlightFreeDelivery': 'توصيل مجاني',
    'cart.highlightFasterDispatch': 'إرسال أسرع',
    'cart.highlight5xRewards': 'مكافآت 5 مرات',
    'cart.highlightOnOrders35Plus': 'على طلبات أكثر من 35$',
    'cart.highlightPriorityHandling': 'معالجة ذو أولوية',
    'cart.bundleAdded': 'تمت إضافة {{itemName}} إلى سلتك كحزمة ذكية.',
    'cart.appliedPromoLabel': 'تم تطبيق {{label}}: {{description}}',

    'orderHistory.statusDelivered': 'تم التوصيل',
    'orderHistory.statusShipped': 'تم الإرسال',
    'orderHistory.statusPending': 'قيد الانتظار',

    'featured.sectionLabel': 'لماذا Food Haven',
    'featured.sectionTitle': 'ميزات حديثة مصممة لعشاق الطعام',
    'featured.joinToday': 'انضم اليوم',
    'featured.fastDelivery': 'توصيل سريع',
    'featured.fastDeliveryDesc': 'احصل على وجبتك ساخنة وجاهزة مع توصيل موثوق في نفس اليوم.',
    'featured.freshIngredients': 'مكونات طازجة',
    'featured.freshIngredientsDesc': 'كل طبق مصنوع من منتجات طازجة ومكونات موسمية متميزة.',
    'featured.secureCheckout': 'دفع آمن',
    'featured.secureCheckoutDesc': 'استمتع بمرحلة دفع سلسة مع دفع آمن وتأكيد فوري.',
    'featured.chefsPicks': 'اختيارات الشيف',
    'featured.chefsPicksDesc': 'وجبات مختارة بعناية من قبل أفضل الشيفات لتجربة طعام مميزة.',
    'featured.badgeTrending': 'رائج',
    'featured.badgeNew': 'جديد',
    'featured.badgeSafe': 'آمن',
    'featured.badgePremium': 'مميز',
  },
};

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  private document = inject(DOCUMENT);
  locale = signal<Locale>('en');
  direction = computed(() => (this.locale() === 'ar' ? 'rtl' : 'ltr'));

  constructor() {
    this.initialize();
    effect(() => {
      this.updateDocumentAttributes();
    });
  }

  initialize(): void {
    const saved = this.getSavedLocale();
    if (saved) {
      this.locale.set(saved);
    }
    this.updateDocumentAttributes();
  }

  setLocale(locale: Locale): void {
    if (!TRANSLATIONS[locale]) {
      return;
    }
    this.locale.set(locale);
    this.saveLocale(locale);
    this.updateDocumentAttributes();
  }

  t(key: string, values?: Record<string, string | number>): string {
    const translation = this.getTranslation(key);
    if (!translation) {
      return key;
    }

    if (!values) {
      return translation;
    }

    return translation.replace(/{{\s*([\w]+)\s*}}/g, (_match, name) => {
      return String(values[name] ?? '');
    });
  }

  private getTranslation(key: string): string | null {
    const locale = this.locale();
    const dictionary = TRANSLATIONS[locale];
    return dictionary[key] ?? null;
  }

  private getSavedLocale(): Locale | null {
    try {
      return (
        (this.document.defaultView?.localStorage.getItem(STORAGE_KEY) as Locale | null) ?? null
      );
    } catch {
      return null;
    }
  }

  private saveLocale(locale: Locale): void {
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore storage errors on server or private mode
    }
  }

  private updateDocumentAttributes(): void {
    if (!this.document) {
      return;
    }
    this.document.documentElement.lang = this.locale();
    this.document.documentElement.dir = this.direction();
  }
}

import { faMessage } from '@fortawesome/free-regular-svg-icons';
import { faHome,faBookmark,faUserGroup,faUser,faEdit,faFolderPlus,faLayerGroup,faNotesMedical,faCompass, faSearch, faGear} from '@fortawesome/free-solid-svg-icons';
import store from '../Store';
import { useSelector } from 'react-redux';


export const SidebarLinksHome = () => {
  const user = useSelector(state => state?.users);

  const sidebarLinksHome = [
      {
        route: "/home",
        label: "Home",
        icon: "faHome"
      },
      {
        route: "/user/saved",
        label: "Saved",
        icon : "faBookmark"
      },
      {
        route: "/user/createpost",
        label: "Create Post",
        icon:"faFolderPlus"
      },
      {
        route: "/search",
        label: "Search",
        icon:"faSearch"
      },
      {
        route: "/user/friends",
        label: "Friends",
        icon:"faUserGroup"
      },
      {
        route: "/user/messages",
        label: "Messages",
        icon:"faMessage"
      },
      {
        route: "/user/settings",
        label: "Settings",
        icon:"faGear"
      },
      {
        route: `/user/userprofile/${user._id}`,
        label: "Profile",
      }
    ];

  return sidebarLinksHome;
};

export const bottomBarLinksHome = () => {
  const user = useSelector(state => state.users);

  const bottomBarHome = [
      {
        route: "/home",
        label: "Home",
        icon: "faHome"
      },
      {
        route: "/search",
        label: "Search",
        icon:"faSearch"
      },
      {
        route: "/user/createpost",
        label: "Post",
        icon:"faFolderPlus"
      },
      {
        route: "/user/messages",
        label: "Messages",
        icon:"faMessage"
      },

      {
        route: `/user/userprofile/${user._id}`,
        label: "Profile",
      }
    ];

  return bottomBarHome;
};


  export const iconsDataHome = {
    "faHome": faHome,
    "faCompass": faCompass,
    "faUser": faUser,
    "faBookmark":faBookmark,
    "faFolderPlus":faFolderPlus,
    "faSearch":faSearch,
    "faUserGroup":faUserGroup,
    "faMessage":faMessage,
    "faGear":faGear
  };
  



  export const commercials = [
    {
      imgURL: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      route: "https://www.mender.shop/",
      name: "Mender",
      description: "Mender for better you"
    },
    {
      imgURL: "https://images.unsplash.com/photo-1612817288765-6d2b644c762e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      route: "https://murilelu.com/",
      name: "Muri Lelu",
      description:"Muri Lelu has the best products visit our website for more details"
    },
    {
      imgURL: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      route: "https://www.marriott.com/default.mi?nst=paid&cid=PAI_GLB00050CK_GLE000BLSZ_GLF000ONTS&ppc=ppc&pId=intbppc&ds_rl=1301220&gad_source=1&ds_rl=1301220&gclid=Cj0KCQiAo7KqBhDhARIsAKhZ4ujpog8c-_MjH0cKaUIVoECJ4lGwSvWBxx9_adq11XSTlSOaqXUjkH0aAgWOEALw_wcB&gclsrc=aw.ds",
      name: "Marriot Hotels",
      description:"The way to heart is through food."
    },
    {
      imgURL: "https://media.istockphoto.com/id/1216515982/photo/waterfalls.webp?s=170667a&w=0&k=20&c=3Yi1YF8Ho8pripigtbpj1w_LFuhyr1ZcuWg6B3YuBFg=",
      route: "https://www.makemytrip.com/flights/?gclid=Cj0KCQiAo7KqBhDhARIsAKhZ4uiegf-4zoFChaIhZJeWh80E65H_1Mjc-f6rKALXtYkCB7fU1ghaZ_EaAgn8EALw_wcB&cmp=SEM|D|DF|G|Generic|Generic-Generic_DT|DF_Generic_Exact|RSA|Offer3|673438880768&s_kwcid=AL!1631!3!673438880768!e!!g!!make%20my&ef_id=Cj0KCQiAo7KqBhDhARIsAKhZ4uiegf-4zoFChaIhZJeWh80E65H_1Mjc-f6rKALXtYkCB7fU1ghaZ_EaAgn8EALw_wcB:G:s&gad_source=1",
      name: "Make my trip",
      description : "Visit our website to plan a trip."
    },
    {
      imgURL: "https://media.istockphoto.com/id/696674082/photo/bowl-of-strawberry-ice-cream.jpg?s=612x612&w=0&k=20&c=0wFRrNEMM5zUkKJz6wVy7EgVKbCPxiT-l1-_n3FDUQk=",
      route: "http://www.creamstoneconcepts.com/",
      name: "Cream Stone",
      description:"If you have a sweet tooth this place is your heaven."
    },
  ];


  export const imgBaseUrl = "http://3.110.119.124:8080"

  export const baseUrl = "http://3.110.119.124:8080/foxial/api"

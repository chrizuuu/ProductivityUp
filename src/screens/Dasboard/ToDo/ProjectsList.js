import React, {
    useState, 
    useLayoutEffect,
} from "react";
import {
    Text, 
    FlatList,
    View, 
    StyleSheet,
    TouchableOpacity,
    Pressable,
} from "react-native";
import realm, { 
    getAllProjects,
    createProject 
} from "../../../Database/Database"
import {Icon} from "react-native-elements";
import Modal from "react-native-modal";
import { strings } from "../../../translations/translations";
import sharedStyles from "../../../styles/shared";
import ProjectItem from "../../../components/components/ProjectItem";
import ModalCreateProject from "../../../components/ModalComponents/ModalCreateProject";
import TasksList from "./TasksList";

const ProjectsList = ({navigation}) => {
    const [projects,setProjects] = useState(getAllProjects())
    const [visibleCreateProject,setVisibleCreateProject] = useState(false)

    useLayoutEffect(() => {
        navigation.setOptions({
        headerRight: () => (
            <TouchableOpacity 
                style={{marginRight:11}} 
                onPress={() => setVisibleCreateProject(true)}
            >
                <Icon 
                    type='ionicon'
                    name='add-circle-outline' 
                />      
            </TouchableOpacity>    
            ),
        });
    }, [navigation]);


    function onRealmChange() {
        setProjects(getAllProjects())
        setVisibleCreateProject(false)
      }
      
    realm.addListener("change", onRealmChange);

    const styles = StyleSheet.create({
        container: {
            flex:1,
            paddingBottom:25,
            backgroundColor:"rgb(244, 244, 244)"
        },
        

        textInput: {
            borderColor: "rgb(200,200,200)", 
            backgroundColor:"rgb(245,245,245)",
            height:40,
            color:"black",
            paddingVertical:8,
            paddingHorizontal:25
        },
    })
 
    return (
        <>
            <View style={styles.container} >     
                <FlatList
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={"handled"}
                    data={projects}
                    showsVerticalScrollIndicator ={false}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={({item}) => {
                        return (
                        <Pressable onPress={() => {
                            navigation.navigate('ProjectTasks', {
                                project:item.title,
                            });
                          }} >
                            <ProjectItem item_id={item._id} />
                        </Pressable>
                    )}} 
                />    
            </View> 
            <Modal 
                animationIn="slideInUp"
                animationOut="slideOutDown"
                swipeDirection="down"
                isVisible={visibleCreateProject} 
                backdropOpacity={0.4}
                onSwipeComplete={() => setVisibleCreateProject(!visibleCreateProject)}
                onBackdropPress={() => setVisibleCreateProject(!visibleCreateProject)}
            > 
                <ModalCreateProject closeFunc={() => setVisibleCreateProject(!visibleCreateProject)} />
            </Modal>
        </>
    );
};

export default React.memo(ProjectsList)